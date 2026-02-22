import { ParkingInfoHashType, VehicleDepart } from '@parking/validations';
import {
  formatDateTimeReadable24,
  getHoursFromParkingPriceType,
  isEmail,
} from './utilities';

export function getParkingInfoHash(parkingInfo: any) {
  const [parkedDate, parkedTime] = formatDateTimeReadable24(
    parkingInfo.entry_time_stamp,
  );

  const parkedByUserInfo = parkingInfo.parkedBy;
  const parkedByAdminInfo = parkingInfo.entryAdmin?.user;
  const parkingAreaInfo = parkingInfo.parkingArea;

  const parkingEntryTimeStamp = new Date(parkingInfo.entry_time_stamp);
  const now = new Date();

  const parkingFee = parseFloat(
    parkingInfo.vehicle_type === 'car'
      ? parkingAreaInfo.car_fine_price
      : parkingAreaInfo.bike_fine_price,
  );
  const pricingType = getHoursFromParkingPriceType(
    parkingAreaInfo.pricing_type,
  );

  const diffMs = now.getTime() - parkingEntryTimeStamp.getTime();
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

  const parkingPrice =
    Math.ceil(diffHours / pricingType) * parkingFee * pricingType;

  const parkedInfoHash = {
    parking_id: parkingInfo.id,
    parked_user_id: parkingInfo.parked_user_id,
    admin_user_id: parkingInfo.parking_entry_admin_id,
    parking_area_id: parkingInfo.parking_area_id,
    vehicle_number: parkingInfo.vehicle_number,
    vehicle_type: parkingInfo.vehicle_type,
    slot_number: parkingInfo.slot_number,
    status: parkingInfo.status,
    parked_date: parkedDate,
    parked_time: parkedTime,
    parked_user_name: parkedByUserInfo.name,
    parked_user_avathar: parkedByUserInfo.avathar,
    parked_user_user_type: parkedByUserInfo.user_type,
    parked_user_email: parkedByUserInfo.email,
    parking_area_name: parkingAreaInfo.name,
    parking_area_location: parkingAreaInfo.parking_location,
    parking_is_opened: parkingAreaInfo.is_opened,
    parking_price: parkingPrice,
    parking_fee: parkingFee * pricingType,
    parking_price_type: parkingAreaInfo.pricing_type,
    parking_entry_time: parkingInfo.entry_time_stamp,
    parking_parked_hours: diffHours,
    parking_other_info: parkingInfo?.other_info,
  };

  const departParkingInfoHash = {
    departed_user_name: '',
    departed_user_avathar: '',
    departed_user_user_type: '',
    departed_user_email: '',
    departed_admin_name: '',
    departed_admin_avathar: '',
    departed_admin_user_type: '',
    departed_admin_email: '',
  };
  const parkedByAdminHash = {
    parked_admin_name: '',
    parked_admin_avathar: '',
    parked_admin_user_type: '',
    parked_admin_email: '',
  };

  if (parkedByAdminInfo) {
    parkedByAdminHash.parked_admin_name = parkedByAdminInfo.name;
    parkedByAdminHash.parked_admin_avathar = parkedByAdminInfo.avathar;
    parkedByAdminHash.parked_admin_user_type = parkedByAdminInfo.user_type;
    parkedByAdminHash.parked_admin_email = parkedByAdminInfo.email;
  }

  if (parkingInfo.depature_time_stamp) {
    const departedByAdminInfo = parkingInfo.departureAdmin.user;
    const departedByUserInfo = parkingInfo.departedBy;

    departParkingInfoHash['departed_user_name'] = departedByUserInfo.name;
    departParkingInfoHash['departed_user_avathar'] = departedByUserInfo.avathar;
    departParkingInfoHash['departed_user_user_type'] =
      departedByUserInfo.user_type;
    departParkingInfoHash['departed_user_email'] = departedByUserInfo.email;
    departParkingInfoHash['departed_admin_name'] = departedByAdminInfo.name;
    departParkingInfoHash['departed_admin_avathar'] =
      departedByAdminInfo.avathar;
    departParkingInfoHash['departed_admin_user_type'] =
      departedByAdminInfo.user_type;
    departParkingInfoHash['departed_admin_email'] = departedByAdminInfo.email;

    return {
      ...parkedByAdminHash,
      ...departParkingInfoHash,
      ...parkedInfoHash,
    };
  }

  return {
    ...parkedByAdminHash,
    ...parkedInfoHash,
  };
}

export function validateInputParking(data: VehicleDepart) {
  const email = data.user_identification;
  const errors: string[] = [];

  if (!isEmail(email)) {
    errors.push('Email is not valid');
  }

  const departCode = data.depart_code;

  if (departCode.length !== 8) {
    errors.push('Depart code is not valid');
  }

  const slot = data.slot;

  if (Number(slot) === 0) {
    errors.push('Slot is not valid');
  }
  const vehicleType = data.vehicle_type;

  if (!(vehicleType === 'bike' || vehicleType === 'car')) {
    errors.push('Vehicle Type is not valid');
  }

  if (errors.length > 0) {
    return { status: false, errors };
  }
  return { status: true };
}
