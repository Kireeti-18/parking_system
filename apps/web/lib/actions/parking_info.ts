'use server';

import {
  getHoursFromParkingPriceType,
  getParkingInfoHash,
  STATUS,
} from '@parking/services';
import getSessionData from '../../components/server/getSessionData';
import prisma, { Prisma } from '@parking/db';
import {
  isValidType,
  LatLng,
  ParkingsType,
  ParkingInfoHashType,
  ParkingStatus,
  ParkingStatusType,
  PricingTypeSet,
  PricingTypeType,
  SessionParkingInfo,
  VehicleDepart,
  VehicleType,
  VehicleTypeType,
  ParkingType,
  VehicleEntry,
} from '@parking/validations';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export async function getParkingSlotsStatusInfo(
  statuses: ParkingStatusType[] = [],
  parkingId?: string,
) {
  const { userInfo, parkingInfo } = await getSessionData();
  const { current_parking_index, parking_data } = parkingInfo;

  let currentParkingArea;
  if (userInfo?.user_type === 'admin')
    currentParkingArea = (parking_data ?? [])[current_parking_index];
  else {
    const parking = await getParkingInfo({
      id: parkingId || '',
      only_info: true,
    });
    currentParkingArea = parking.parking_info;
  }

  const slotsInfo = await getParkingDetails(currentParkingArea, statuses);

  return {
    status: STATUS.OK,
    bike_slots: slotsInfo.bike_slots,
    car_slots: slotsInfo.car_slots,
    bike_slots_info: slotsInfo.bike_slots_info,
    car_slots_info: slotsInfo.car_slot_info,
  };
}

const getParkingDetails = async (
  parkingArea: any,
  statuses: ParkingStatusType[],
) => {
  const occupiedSlots = await prisma.parkings.findMany({
    where: {
      parking_area_id: parkingArea?.parking_area_id,
      status: { not: ParkingStatus.DEPARTED },
    },
    include: {
      parkedBy: true,
      entryAdmin: {
        include: {
          user: true,
        },
      },
      parkingArea: true,
    },
  });

  let bikeSlots: Record<number, ParkingInfoHashType> = Object.fromEntries(
    Array.from({ length: parkingArea?.bike_slots || 0 }, (_, i) => [
      i + 1,
      {
        status: ParkingStatus.AVAILABLE as ParkingStatusType,
        parking_id: '',
      },
    ]),
  );

  let carSlots: Record<number, ParkingInfoHashType> = Object.fromEntries(
    Array.from({ length: parkingArea?.car_slots || 0 }, (_, i) => [
      i + 1,
      {
        status: ParkingStatus.AVAILABLE as ParkingStatusType,
        parking_id: '',
      },
    ]),
  );

  for (const slotInfo of occupiedSlots) {
    const slotNumber = Number(slotInfo.slot_number);
    if (Number.isNaN(slotNumber)) continue;

    const vt = slotInfo.vehicle_type as VehicleTypeType;

    if (
      vt === VehicleType.BIKE &&
      slotNumber <= (parkingArea?.bike_slots ?? 0)
    ) {
      bikeSlots[slotNumber] = getParkingInfoHash(slotInfo);
    }

    if (vt === VehicleType.CAR && slotNumber <= (parkingArea?.car_slots ?? 0)) {
      carSlots[slotNumber] = getParkingInfoHash(slotInfo);
    }
  }

  if (statuses.length > 0) {
    const allowed = new Set<ParkingStatusType>(statuses);

    bikeSlots = Object.fromEntries(
      Object.entries(bikeSlots).filter(([, st]) => {
        if (!st) return false;
        if ('status' in st && st.status !== undefined) {
          return allowed.has(st.status as ParkingStatusType);
        }
        return false;
      }),
    ) as Record<number, ParkingInfoHashType>;

    carSlots = Object.fromEntries(
      Object.entries(carSlots).filter(([, st]) => {
        if (!st) return false;
        if ('status' in st && st.status !== undefined) {
          return allowed.has(st.status as ParkingStatusType);
        }
        return false;
      }),
    ) as Record<number, ParkingInfoHashType>;
  }

  const BikeSlotInfo = Object.values(bikeSlots).reduce(
    (acc, slot) => {
      if (!slot || !slot.status) return acc;

      const status = slot.status as ParkingStatusType;
      acc[status] = (acc[status] ?? 0) + 1;

      return acc;
    },
    {} as Record<ParkingStatusType, number>,
  );

  const CarSlotInfo = Object.values(carSlots).reduce(
    (acc, slot) => {
      if (!slot || !slot.status) return acc;

      const status = slot.status as ParkingStatusType;
      acc[status] = (acc[status] ?? 0) + 1;

      return acc;
    },
    {} as Record<ParkingStatusType, number>,
  );

  return {
    bike_slots: bikeSlots,
    bike_slots_info: BikeSlotInfo,
    car_slots: carSlots,
    car_slot_info: CarSlotInfo,
  };
};

export async function getParkingInfoAction(data: {
  parking_id?: string;
  slot?: number;
  slot_type?: string;
  parking_code?: string;
}) {
  let filter = {};
  if (data?.parking_id) {
    filter = { id: data?.parking_id };
  }

  if (data?.slot && data?.slot_type) {
    const { currentParkingInfo } = await getSessionData();
    filter = {
      slot_number: data?.slot,
      vehicle_type: data?.slot_type,
      parking_area_id: currentParkingInfo?.parking_area_id,
      NOT: {
        status: 'departed',
      },
    };
  }

  const parkingInfo = await prisma.parkings.findFirst({
    where: filter,
    include: {
      parkedBy: true,
      departedBy: true,
      parkingArea: true,
      entryAdmin: {
        include: {
          user: true,
        },
      },
      departureAdmin: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!parkingInfo) {
    return {
      status: false,
      error: 'No parking entry',
    };
  }

  if ((data.slot || 0) > 0) {
    if (data.parking_code) {
      if (parkingInfo.private_id !== data.parking_code)
        return {
          status: false,
          error: 'Wrong Parking Code',
        };
    } else {
      return {
        status: false,
        error: 'Parking Code is Needed',
      };
    }
  }

  return {
    status: true,
    parkingInfo: getParkingInfoHash(parkingInfo),
  };
}

export async function vehicleEntryAction(data: VehicleEntry) {
  const { userInfo, currentParkingInfo } = await getSessionData();

  const parkingAreaId =
    currentParkingInfo?.parking_area_id || data.parking_area_id;

  const hasParkingInfo = await prisma.parkings.findFirst({
    where: {
      parking_area_id: parkingAreaId,
      OR: [
        { vehicle_type: data.vehicle_type, slot_number: Number(data.slot) },
        { vehicle_number: data.vehicle_number },
      ],
      NOT: {
        status: 'departed',
      },
    },
  });

  if (hasParkingInfo && hasParkingInfo?.status !== 'reserved') {
    if (
      hasParkingInfo?.vehicle_number.length > 0 &&
      hasParkingInfo?.vehicle_number === data.vehicle_number
    ) {
      return { error: 'Vehile already parked' };
    }

    if (
      hasParkingInfo?.slot_number === Number(data.slot) &&
      hasParkingInfo?.vehicle_type === data.vehicle_type
    ) {
      return { error: 'Parking Slot Occupied' };
    }
  }

  let user = await prisma.user.findFirst({
    where: { email: data.user_identification },
  });

  if (!user) {
    if (data.register)
      user = await prisma.user.create({
        data: {
          email: data.user_identification,
          name: '',
          password: '',
          avathar: '',
          verification_status: false,
          user_type: 'user',
        },
      });
    else {
      return { error: 'User not found' };
    }
  }

  const slots = await getParkingSlotsStatusInfo(['available'], parkingAreaId);

  let slot: number = 0;
  if (data.is_custom_slot) {
    slot = Number(data.slot);
  } else {
    if (data.vehicle_type === 'bike') {
      const slotList = Object.keys(slots.bike_slots).map(Number);
      slot =
        slotList.length > 0
          ? slotList[Math.floor(Math.random() * slotList.length)]!
          : 0;
    } else {
      const slotList = Object.keys(slots.car_slots).map(Number);
      slot =
        slotList.length > 0
          ? slotList[Math.floor(Math.random() * slotList.length)]!
          : 0;
    }
  }

  if (!slot || slot === 0) {
    return { error: 'Slots are not available' };
  }

  let parkingInfo;
  if (hasParkingInfo && hasParkingInfo?.status === 'reserved') {
    if (hasParkingInfo.private_id !== data.depart_code) {
      return { status: false, error: 'Wrong Depart code' };
    }
    parkingInfo = await prisma.parkings.update({
      data: { status: 'occupied' },
      where: {
        id: hasParkingInfo.id,
      },
    });
  } else {
    const privateId = crypto.randomInt(0, 1e4).toString().padStart(4, '0');
    parkingInfo = await prisma.parkings.create({
      data: {
        parked_user_id: user.id,
        private_id: privateId,
        parking_entry_admin_id:
          userInfo?.user_type === 'admin' ? userInfo?.user_id || null : null,
        parking_area_id: parkingAreaId || '',
        vehicle_number: data.vehicle_number,
        vehicle_type: data.vehicle_type,
        slot_number: slot,
        status: data.parking_type || 'occupied',
        other_info: {
          ...(data.parking_type === 'reserved' && {
            maintenance_reason: data.maintenance_reason || '',
          }),
        },
      },
    });
  }

  if (!parkingInfo) {
    return {
      status: STATUS.INTERNAL_SERVER_ERROR,
      error: 'Error while parking',
    };
  }

  return {
    status: true,
    parking_id: parkingInfo.id,
  };
}

export async function vehicleDepartAction(data: VehicleDepart) {
  const { userInfo, currentParkingInfo } = await getSessionData();
  let user;

  if (data.is_diff_user) {
    user = await prisma.user.findFirst({
      where: { email: data.user_identification },
    });

    if (!user) {
      if (data.register)
        user = await prisma.user.create({
          data: {
            email: data.user_identification,
            name: '',
            password: '',
            avathar: '',
            verification_status: false,
            user_type: 'user',
          },
        });
      else {
        return { error: 'User not found' };
      }
    }
  }

  const parkingInfo = await prisma.parkings.findFirst({
    where: {
      parking_area_id: currentParkingInfo?.parking_area_id,
      vehicle_type: data.vehicle_type,
      slot_number: Number(data.slot),
    },
  });

  if (!parkingInfo) {
    return { error: 'Parking not found ' };
  }

  if (!data.is_diff_user) {
    user = await prisma.user.findFirst({
      where: { id: parkingInfo.parked_user_id },
    });
  }

  if (parkingInfo?.status === 'occupied') {
    if (parkingInfo?.private_id !== data.depart_code) {
      return { error: 'Wrong Depart Code' };
    }
  } else if (parkingInfo?.status === 'maintenance') {
    const admin_user = await prisma.user.findFirst({
      where: {
        id: userInfo?.user_id,
      },
    });

    if (!admin_user) {
      return { error: 'Admin not found' };
    }
    const match = await bcrypt.compare(data.depart_code, user.password);
    if (!match) return { error: 'Wrong admin password' };
  }

  const otherInfo = {
    created_status: parkingInfo.status,
    created_private_id: parkingInfo?.private_id,
  } as Prisma.JsonObject;

  await prisma.parkings.updateMany({
    where: {
      id: parkingInfo.id,
    },
    data: {
      other_info: otherInfo,
      status: 'departed',
      depature_time_stamp: new Date(),
      depature_user_id: user?.id || '',
      private_id: '',
      parking_depature_admin_id: userInfo?.user_id,
    },
  });
  return {
    status: true,
    parking_id: parkingInfo.id,
  };
}

export async function getParkingAdminAnalytics(
  isAdmin = true,
  other_info: {
    parking_info?: SessionParkingInfo;
  } = {},
) {
  const { bike_slots_info, car_slots_info } = await getParkingSlotsStatusInfo();

  let currentParkingArea: SessionParkingInfo | undefined;
  if (isAdmin) {
    const { parkingInfo } = await getSessionData();
    const { current_parking_index, parking_data } = parkingInfo;
    currentParkingArea = (parking_data ?? [])[current_parking_index];
  } else {
    currentParkingArea = other_info.parking_info;
  }

  const now = new Date();

  const startOfMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0),
  );

  const startOfNextMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0),
  );

  const parkings = await prisma.parkings.findMany({
    where: {
      status: 'departed',
      parking_area_id: currentParkingArea?.parking_area_id,
      depature_time_stamp: {
        gte: startOfMonth,
        lt: startOfNextMonth,
      },
    },
    select: {
      depature_time_stamp: true,
      entry_time_stamp: true,
      vehicle_type: true,
    },
  });

  let month_revenue = 0;
  let today_revenue = 0;

  parkings.forEach((p) => {
    const parkingFee =
      p.vehicle_type === 'car'
        ? Number(currentParkingArea?.car_price_per_hour ?? 0)
        : Number(currentParkingArea?.bike_price_per_hour ?? 0);

    const pricingType = getHoursFromParkingPriceType(
      (currentParkingArea?.pricing_type ?? '1d') as PricingTypeType,
    );

    const diffMs =
      (p.depature_time_stamp ?? now).getTime() - p.entry_time_stamp.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

    const revenue =
      Math.ceil(diffHours / pricingType) * parkingFee * pricingType;

    if ((p.depature_time_stamp ?? now).getUTCDate() === now.getUTCDate()) {
      today_revenue += revenue;
    }
    month_revenue += revenue;
  });

  return {
    over_analytics: {
      available:
        (bike_slots_info.available ?? 0) + (car_slots_info.available ?? 0),
      occupied:
        (bike_slots_info.occupied ?? 0) +
        (bike_slots_info.maintenance ?? 0) +
        (bike_slots_info.reserved ?? 0) +
        (car_slots_info.occupied ?? 0) +
        (car_slots_info.maintenance ?? 0) +
        (car_slots_info.reserved ?? 0),
    },
    bike_analytics: {
      available: bike_slots_info.available ?? 0,
      occupied:
        (bike_slots_info.occupied ?? 0) +
        (bike_slots_info.maintenance ?? 0) +
        (bike_slots_info.reserved ?? 0),
    },
    car_analytics: {
      available: car_slots_info.available ?? 0,
      occupied:
        (car_slots_info.occupied ?? 0) +
        (car_slots_info.maintenance ?? 0) +
        (car_slots_info.reserved ?? 0),
    },
    revenue: {
      month_revenue: month_revenue,
      today_revenue: today_revenue,
    },
  };
}

export async function getNearestParkings(
  lat: number,
  lng: number,
  limit: number = 5,
  maxDistance: number = 0,
  searchKeyword: string | null = '',
) {
  const parkingAreas = await prisma.$queryRaw<
    Array<{
      parking_area_id: string;
      parking_area_name: string;
      parking_location: LatLng;
      bike_slots: number;
      car_slots: number;
      is_opened: boolean;
      pricing_type: string;
      car_price_per_hour: number;
      bike_price_per_hour: number;
      verification_status: boolean;
      other_parking_info: {
        address?: string;
      };
      distance: number;
    }>
  >`
    SELECT
      id as parking_area_id,
      name as parking_area_name,
      parking_location,
      bike_slots,
      car_slots,
      is_opened,
      pricing_type,
      car_price_per_hour::float,
      bike_price_per_hour::float,
      verification_status,
      meta_data::jsonb as other_parking_info,
      (
        6371 * acos(
          cos(radians(${lat})) *
          cos(radians((parking_location->>'lat')::float)) *
          cos(radians((parking_location->>'lng')::float) - radians(${lng})) +
          sin(radians(${lat})) *
          sin(radians((parking_location->>'lat')::float))
        )
      ) AS distance
    FROM "parking_area"
    WHERE parking_location ? 'lat'
      AND parking_location ? 'lng'
      AND (
        ${searchKeyword} IS NULL
        OR ${searchKeyword} = ''
        OR name ILIKE '%' || ${searchKeyword} || '%'
        OR parking_location->'meta_data'->>'address'
          ILIKE '%' || ${searchKeyword} || '%'
      )
    ORDER BY distance
    LIMIT ${limit};
  `;

  const filteredParkings =
    parkingAreas.filter((p) => p.distance < maxDistance) ?? [];

  if (
    filteredParkings.length === 0 &&
    maxDistance === 0 &&
    parkingAreas?.length > 0
  ) {
    const firstParking = parkingAreas[0];

    if (firstParking) {
      filteredParkings.push(firstParking);
    }
  }

  const parkingInfoObj: ParkingsType = [];

  for (const p of filteredParkings) {
    const otherInfo = await getParkingDetails(p, ['available']);
    const pricingType = getHoursFromParkingPriceType(
      (p?.pricing_type ?? '1d') as PricingTypeType,
    );
    parkingInfoObj.push({
      ...p,
      available_bike_slots: Object.keys(otherInfo.bike_slots).length,
      available_car_slots: Object.keys(otherInfo.car_slots).length,
      car_pricing: pricingType * p.car_price_per_hour,
      bike_pricing: pricingType * p.bike_price_per_hour,
    });
  }

  return parkingInfoObj;
}

export async function getParkingInfo(params: {
  id: string;
  only_info?: boolean;
}) {
  const queryFilter: {
    id: string;
  } = { id: params.id };

  try {
    const parkingInfo = await prisma.parkingArea.findFirstOrThrow({
      where: queryFilter,
    });

    const parkingInfoHash: ParkingType = {
      parking_area_name: parkingInfo.name || '',
      parking_area_id: parkingInfo.id,
      bike_slots: parkingInfo.bike_slots,
      car_slots: parkingInfo.car_slots,
      is_opened: parkingInfo.is_opened,
      pricing_type: parkingInfo.pricing_type,
      car_price_per_hour: parkingInfo.car_price_per_hour.toNumber(),
      bike_price_per_hour: parkingInfo.bike_price_per_hour.toNumber(),
      verification_status: parkingInfo.verification_status,
      other_parking_info: {
        address:
          (parkingInfo?.meta_data as { address?: string })?.address ?? '',
      },
      parking_location:
        (parkingInfo?.parking_location as {
          lat: number;
          lng: number;
        } | null) ?? undefined,
    };
    if (params.only_info) {
      return {
        status: true,
        parking_info: parkingInfoHash,
      };
    }

    const slotsInfo = await getParkingDetails(parkingInfo, ['available']);
    const pricingType = getHoursFromParkingPriceType(
      (parkingInfo?.pricing_type ?? '1d') as PricingTypeType,
    );
    return {
      status: STATUS.OK,
      parking_info: {
        ...parkingInfoHash,
        available_bike_slots: Object.keys(slotsInfo.bike_slots).length,
        available_car_slots: Object.keys(slotsInfo.car_slots).length,
        car_pricing: pricingType * parkingInfoHash.car_price_per_hour,
        bike_pricing: pricingType * parkingInfoHash.bike_price_per_hour,
      },
    };
  } catch (e) {
    return {
      status: STATUS.INTERNAL_SERVER_ERROR,
      parking_info: {},
    };
  }
}

export const UpdateParkingStatus = async (
  parkingId: string,
  status: boolean,
) => {
  const session = await getSessionData();

  const userInfo = session.userInfo;

  if (userInfo?.user_type !== 'admin') {
    return {
      status: STATUS.FORBIDDEN,
      message: "User don't have permission.",
    };
  }

  const parkingInfo = session.parkingInfo.parking_data;
  const hasAccess = parkingInfo.some((p) => p.parking_area_id === parkingId);

  if (!hasAccess) {
    return {
      status: STATUS.FORBIDDEN,
      message: "User don't have permission for this parking.",
    };
  }

  await prisma.parkingArea.update({
    where: {
      id: parkingId,
    },
    data: { is_opened: status },
  });

  // await update({ current_parking_index: index });

  return {
    status: STATUS.OK,
    message: 'Parking status updated successfully.',
  };
};

export const UpdateParkingDetails = async (data: {
  parkingId: string;
  parkingName: string;
  pricingType: string;
  carPricePerHour: number;
  bikePricePerHour: number;
}) => {
  const session = await getSessionData();
  const userInfo = session.userInfo;

  if (userInfo?.user_type !== 'admin') {
    return {
      status: STATUS.FORBIDDEN,
      message: "User don't have permission.",
    };
  }

  const parkingInfo = session.parkingInfo.parking_data;
  const hasAccess = parkingInfo.some((p) => p.parking_area_id === data.parkingId);

  if (!hasAccess) {
    return {
      status: STATUS.FORBIDDEN,
      message: "User don't have permission for this parking.",
    };
  }

  const parkingName = (data.parkingName || '').trim();
  const pricingType = (data.pricingType || '').trim();
  const carPrice = Number(data.carPricePerHour);
  const bikePrice = Number(data.bikePricePerHour);

  if (!parkingName) {
    return {
      status: STATUS.BAD_REQUEST,
      message: 'Parking name is required.',
    };
  }

  if (!isValidType(PricingTypeSet, pricingType)) {
    return {
      status: STATUS.BAD_REQUEST,
      message: 'Invalid pricing type.',
    };
  }

  if (Number.isNaN(carPrice) || carPrice < 0) {
    return {
      status: STATUS.BAD_REQUEST,
      message: 'Invalid car price.',
    };
  }

  if (Number.isNaN(bikePrice) || bikePrice < 0) {
    return {
      status: STATUS.BAD_REQUEST,
      message: 'Invalid bike price.',
    };
  }

  try {
    await prisma.parkingArea.update({
      where: { id: data.parkingId },
      data: {
        name: parkingName,
        pricing_type: pricingType as PricingTypeType,
        car_price_per_hour: new Prisma.Decimal(carPrice),
        bike_price_per_hour: new Prisma.Decimal(bikePrice),
      },
    });

    return {
      status: STATUS.OK,
      message: 'Parking details updated successfully.',
    };
  } catch (error) {
    console.error('Failed to update parking details:', error);
    return {
      status: STATUS.INTERNAL_SERVER_ERROR,
      message: 'Failed to update parking details.',
    };
  }
};

export const GetParkingSlotsStatusInfo = getParkingSlotsStatusInfo;
export const GetParkingInfoAction = getParkingInfoAction;
export const VehicleEntryAction = vehicleEntryAction;
export const VehicleDepartAction = vehicleDepartAction;
export const GetParkingAdminAnalytics = getParkingAdminAnalytics;
