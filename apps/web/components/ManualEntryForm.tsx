'use client';

import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { Button, Dropdown, InputBox, CustomCheckbox } from './components';
import { VehicleEntry } from '@parking/validations';
import {
  getParkingSlotsStatusInfo,
  vehicleEntryAction,
} from '../lib/actions/parking_info';
import { useRouter } from 'next/navigation';
import { loaderAtom, useShowAlert } from '@parking/services';
import { useSession } from 'next-auth/react';

function EntryButton({ data, text }: { data: VehicleEntry; text: string }) {
  const router = useRouter();
  const showAlert = useShowAlert();
  const setLoader = useSetAtom(loaderAtom);
  return (
    <Button
      onSubmit={async () => {
        setLoader(true);
        const response = await vehicleEntryAction(data);
        if (response.status) router.push(`/admin/entry/${response.parking_id}`);
        else {
          showAlert(response?.error || 'Something went wrong');
          setLoader(false);
        }
      }}
      styles={`text-lg text-gray-50 rounded-lg text-base mt-5 font-bold cursor-pointer bg-primary`}
      btnColor="primary"
    >
      {text}
    </Button>
  );
}

type AvailableSlots = { bike_slots: number[]; car_slots: number[] };

export default function ManualEntryForm({
  type = '',
  border = true,
  slotNumber = '0',
  slotType = '',
  slotInfo = {},
  userType = 'admin',
  parkingAreaId = '',
}: {
  type?: string;
  border?: boolean;
  slotNumber?: string;
  slotType?: string;
  slotInfo?: any;
  userType?: 'user' | 'admin';
  parkingAreaId: string;
}) {
  const inputBoxWidth =
    'w-[100%] border-gray-300/50 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:border-gray-500 text-lg px-3 py-3  placeholder:text-[14px] md:placeholder:text-[16px]';
  const labelstyles = 'text-md md:text-lg text-gray-700 font-semibold';

  const sessionData = useSession();
  const userData = sessionData?.data?.user || {};

  const [entryVehicleData, setEntryVehicleData] = useState({
    parking_type:
      slotInfo?.status === 'reserved'
        ? userType == 'admin'
          ? 'occupied'
          : 'reserved'
        : '',
    user_identification:
      slotInfo?.status === 'reserved' ? slotInfo?.parked_user_email : '',
    vehicle_number:
      slotInfo?.status === 'reserved' ? slotInfo?.vehicle_number : '',
    vehicle_type: slotType,
    register: false,
    is_custom_slot: type === 'slot_card',
    slot: Number(slotNumber),
    backup_user_identification: '',
    maintenance_reason: '',
    depart_code: '',
  });

  const [availableSlots, setAvailableSlots] = useState<AvailableSlots>({
    bike_slots: [],
    car_slots: [],
  });

  const updateUserData = (attr: string, value: string | number | boolean) => {
    setEntryVehicleData((prev) => {
      const result = {
        ...prev,
        [attr]: value,
      };
      return result;
    });
  };

  const getAvailableSlots = async () => {
    const slots = await getParkingSlotsStatusInfo([
      slotInfo?.status === 'reserved' ? 'reserved' : 'available',
    ]);
    const bikeSlots = Object.keys(slots.bike_slots)?.map(Number) || [];
    const carSlots = Object.keys(slots.car_slots)?.map(Number) || [];

    setAvailableSlots({
      bike_slots: bikeSlots,
      car_slots: carSlots,
    });
  };

  useEffect(() => {
    getAvailableSlots();
  }, []);

  const actionPermissions = {
    parking_type: {
      enable: true,
      default: slotInfo?.status === 'reserved',
      disabled: slotInfo?.status === 'reserved',
    },
    maintenance_reason: {
      enable: entryVehicleData.parking_type === 'maintenance',
      disabled: entryVehicleData.parking_type !== 'maintenance',
    },
    depart_code: {
      enable: slotInfo?.status === 'reserved' && userType === 'admin',
    },
    user_email: {
      enable: true,
      disabled:
        entryVehicleData.parking_type === 'maintenance' ||
        slotInfo?.status === 'reserved',
    },
    vehicle_number: {
      enable: entryVehicleData.parking_type !== 'maintenance',
      disabled: slotInfo?.status === 'reserved' && userType === 'admin',
    },
    vehicle_type: {
      enable: true,
      default: type === 'slot_card',
      disabled: type === 'slot_card',
    },
    register_user: {
      enable: userType === 'admin',
      disabled: slotInfo?.status === 'reserved',
    },
    custom_slot: {
      enable: userType === 'admin' && entryVehicleData.vehicle_type.length,
      disabled: type === 'slot_card' || userType === 'user',
    },
    custom_slot_number: {
      enable: userType === 'admin' && entryVehicleData.is_custom_slot,
      disabled: type === 'slot_card',
      default: type === 'slot_card',
    },
  };

  return (
    <div
      className={`bg-white my-10 ${type === 'slot_card' || type === 'reserve' ? 'px-7 w-[100%]' : 'p-7 sm:w-md lg:w-[60vh]'} rounded-xl ${border ? 'shadow-sm' : ''}`}
    >
      <span className="text-3xl text-gray-900 font-bold flex justify-center">
        Vehicle Entry Information
      </span>
      <div>
        {actionPermissions.parking_type.enable && (
          <Dropdown
            label="Parking Type"
            placeholder="Select Type"
            options={[
              { value: 'maintenance', name: 'Maintenance' },
              { value: 'occupied', name: 'New Parking' },
              { value: 'reserved', name: 'Reserved' },
            ]}
            styles={'mt-7 mb-3'}
            labelstyles={labelstyles}
            selectedTextStyles=""
            isDefault={actionPermissions.parking_type.default}
            defaultSelectedValue={entryVehicleData.parking_type}
            disabled={actionPermissions.parking_type.disabled}
            onChange={(v) => {
              updateUserData('parking_type', v);
              if (v === 'maintenance') {
                updateUserData(
                  'backup_user_identification',
                  entryVehicleData.user_identification || '',
                );
                updateUserData('user_identification', userData?.email || '');
              } else {
                updateUserData(
                  'user_identification',
                  entryVehicleData.backup_user_identification || '',
                );
              }
            }}
          />
        )}
        {actionPermissions.maintenance_reason.enable && (
          <InputBox
            type="text"
            label="Maintenance Reason"
            id="manual_entry_maintenance_reason"
            placeholder="Enter Maintenance Reason"
            value={entryVehicleData.maintenance_reason || ''}
            disabled={actionPermissions.maintenance_reason.disabled}
            onChange={(e) =>
              updateUserData('maintenance_reason', e.target.value)
            }
            styles={`${inputBoxWidth} mb-3`}
            labelstyles={labelstyles}
            required
            withToggle
          />
        )}
        {actionPermissions.depart_code.enable && (
          <InputBox
            type="text"
            label="Depart Code"
            id="manual_entry_depart_code"
            placeholder="Enter Depart code"
            value={entryVehicleData.depart_code || ''}
            onChange={(e) => updateUserData('depart_code', e.target.value)}
            styles={`${inputBoxWidth} mb-3`}
            labelstyles={labelstyles}
            required
            withToggle
          />
        )}
        {actionPermissions.user_email.enable && (
          <InputBox
            type="text"
            label="User Email"
            id="manual_entry_user_email"
            placeholder="Enter User Email"
            value={entryVehicleData.user_identification || ''}
            disabled={actionPermissions.user_email.disabled}
            onChange={(e) =>
              updateUserData('user_identification', e.target.value)
            }
            styles={`${inputBoxWidth} mb-3`}
            labelstyles={labelstyles}
            required
            withToggle
          />
        )}

        {actionPermissions.vehicle_number.enable && (
          <InputBox
            type="text"
            label="Vehicle Number"
            id="manual_entry_vehicle_number"
            placeholder="Enter Vehicle Number"
            value={entryVehicleData.vehicle_number || ''}
            onChange={(e) => updateUserData('vehicle_number', e.target.value)}
            disabled={actionPermissions.vehicle_number.disabled}
            labelstyles={labelstyles}
            styles={inputBoxWidth}
            required
          />
        )}
        {actionPermissions.vehicle_type.enable && (
          <Dropdown
            label="Vehicle Type"
            placeholder="Select Type"
            options={[
              { value: 'bike', name: 'Bike' },
              { value: 'car', name: 'Car' },
            ]}
            styles={'mt-3'}
            labelstyles={labelstyles}
            selectedTextStyles=""
            isDefault={actionPermissions.vehicle_type.default}
            defaultSelectedValue={entryVehicleData.vehicle_type}
            disabled={actionPermissions.vehicle_type.disabled}
            onChange={(v) => updateUserData('vehicle_type', v)}
          />
        )}
        <div className="mt-5 grid grid-cols-2">
          {actionPermissions.register_user.enable && (
            <CustomCheckbox
              textFalse="Register user"
              textTrue="Register user"
              labelStyle="text-md"
              onChange={(v) => updateUserData('register', v)}
              disabled={actionPermissions.register_user.disabled}
            />
          )}
          {actionPermissions.custom_slot.enable && (
            <CustomCheckbox
              textFalse="Custom Slot"
              textTrue="Custom Slot"
              labelStyle="text-md"
              checked={type === 'slot_card'}
              disabled={actionPermissions.custom_slot.disabled}
              onChange={(v) => updateUserData('is_custom_slot', v)}
            />
          )}
        </div>
        {actionPermissions.custom_slot_number.enable && (
          <Dropdown
            label="Custom Slot"
            placeholder="Slot Number"
            options={
              entryVehicleData.vehicle_type === 'bike'
                ? availableSlots.bike_slots.map((s) => ({
                    value: s,
                    name: s.toString(),
                  }))
                : availableSlots.car_slots.map((s) => ({
                    value: s,
                    name: s.toString(),
                  }))
            }
            styles={'mt-3'}
            labelstyles={labelstyles}
            selectedTextStyles=""
            isDefault={actionPermissions.custom_slot_number.default}
            defaultSelectedValue={entryVehicleData.slot}
            disabled={actionPermissions.custom_slot_number.disabled}
            onChange={(v) => updateUserData('slot', v)}
          />
        )}

        <div>
          <EntryButton
            data={{
              user_identification: entryVehicleData.user_identification,
              vehicle_number: entryVehicleData.vehicle_number,
              vehicle_type: entryVehicleData.vehicle_type,
              register: entryVehicleData.register,
              is_custom_slot: entryVehicleData.is_custom_slot,
              slot: entryVehicleData.slot,
              parking_type: entryVehicleData.parking_type,
              maintenance_reason: entryVehicleData.maintenance_reason,
              depart_code: entryVehicleData.depart_code,
              parking_area_id: parkingAreaId,
            }}
            text="Entry Vehicle"
          />
        </div>
      </div>
    </div>
  );
}
