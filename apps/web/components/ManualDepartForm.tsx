'use client';

import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import {
  Button,
  CustomCheckbox,
  Dropdown,
  InputBox,
  Popup,
  QRScanner,
} from './components';
import {
  OnlyParkingInfoHashType,
  ParkingStatusType,
  VehicleDepart,
} from '@parking/validations';
import { useRouter } from 'next/navigation';
import { loaderAtom, TitleCase, useShowAlert } from '@parking/services';
import {
  getParkingInfoAction,
  getParkingSlotsStatusInfo,
  vehicleDepartAction,
} from '../lib/actions/parking_info';

function DepartButton({ data, text }: { data: VehicleDepart; text: string }) {
  const router = useRouter();
  const showAlert = useShowAlert();
  const setLoader = useSetAtom(loaderAtom);

  return (
    <Button
      onSubmit={async () => {
        setLoader(true);
        const response = await vehicleDepartAction(data);
        if (response.status)
          router.push(`/admin/depart/${response.parking_id}`);
        else if (response.error) {
          showAlert(response.error);
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

export default function ManualDepartForm({
  options = 'both',
  border = true,
  type = '',
  slotNumber = '0',
  slotType = '',
  slotStatus = 'occupied',
}: {
  options?: 'both' | 'manual' | 'scan';
  border?: boolean;
  type?: string;
  slotNumber?: string;
  slotType?: string;
  slotStatus?: ParkingStatusType;
}) {
  const inputBoxWidth =
    'w-[100%] border-gray-300/50 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:border-gray-500 text-lg px-3 py-3  placeholder:text-[14px] md:placeholder:text-[16px]';
  const labelstyles = 'text-md md:text-lg text-gray-700 font-semibold';

  const [departVehicleData, setDepartVehicleData] = useState({
    is_diff_user: false,
    user_identification: '',
    vehicle_type: slotType,
    depart_code: '',
    slot: Number(slotNumber),
    depart_type: options == 'both' ? 'manual' : options,
    register: false,
  });

  const [availableSlots, setAvailableSlots] = useState<AvailableSlots>({
    bike_slots: [],
    car_slots: [],
  });

  const [parkingInfo, setParkingInfo] =
    useState<OnlyParkingInfoHashType | null>(null);

  const [showPopupInfo, setShowPopupInfo] = useState<boolean>(false);
  const setLoader = useSetAtom(loaderAtom);
  const showAlert = useShowAlert();

  const updateUserData = (attr: string, value: string | number | boolean) => {
    setDepartVehicleData((prev) => ({
      ...prev,
      [attr]: value,
    }));
  };

  const getAvailableSlots = async () => {
    const slots = await getParkingSlotsStatusInfo([slotStatus]);
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

  const getParkingInfo = async (
    slot = 0,
    vehicle_type = '',
    depart_code = '',
  ) => {
    setParkingInfo(null);
    if (
      slotStatus !== 'maintenance' &&
      slot > 0 &&
      vehicle_type?.length > 0 &&
      depart_code?.length === 4
    ) {
      setLoader(true);
      const parkingDataInfo = await getParkingInfoAction({
        slot: slot,
        slot_type: vehicle_type,
        parking_code: depart_code,
      });
      setLoader(false);

      if (!parkingDataInfo?.status && parkingDataInfo?.error) {
        showAlert(parkingDataInfo.error, 'failed');
      } else if (parkingDataInfo?.status && parkingDataInfo?.parkingInfo) {
        setShowPopupInfo(true);
        setParkingInfo(parkingDataInfo?.parkingInfo);
      } else {
        showAlert('Something went wrong', 'failed');
      }
    }
  };

  return (
    <div
      className={`bg-white my-10 ${type === 'slot_card' ? 'px-7  w-[100%]' : 'p-7 sm:w-md lg:w-[60vh]'} rounded-xl ${border ? 'shadow-sm' : ''}`}
    >
      <span className="text-3xl text-gray-900 font-bold flex justify-center">
        Vehicle Depart Information
      </span>
      <div>
        {options === 'both' && (
          <div className="w-full mb-3">
            <div
              className={`${inputBoxWidth} flex bg-gray-100 p-1 mt-2 mb-1 rounded-lg`}
            >
              <div
                className={`w-[50%] py-2 text-center rounded-lg cursor-pointer text-gray-800 transition-all duration-300 ease-in-out ${
                  departVehicleData.depart_type === 'manual'
                    ? 'bg-white-50'
                    : 'hover:text-black hover:font-semibold'
                }`}
                onClick={() => updateUserData('depart_type', 'manual')}
              >
                <span className="text-sm md:text-base">Manual</span>
              </div>

              <div
                className={`w-[50%] py-2 text-center rounded-lg cursor-pointer text-gray-800 transition-all duration-300 ease-in-out ${
                  departVehicleData.depart_type === 'scan'
                    ? 'bg-white-50'
                    : 'hover:text-black hover:font-semibold'
                }`}
                onClick={() => updateUserData('depart_type', 'scan')}
              >
                <span className="text-sm md:text-base">Scan</span>
              </div>
            </div>
          </div>
        )}
        {departVehicleData.depart_type === 'manual' ? (
          <div>
            {departVehicleData.is_diff_user && (
              <div className="my-3">
                <InputBox
                  type="text"
                  label="Depart User Email"
                  id="manual_depart_user_email"
                  placeholder="Enter User Email"
                  value={departVehicleData.user_identification || ''}
                  onChange={(e) =>
                    updateUserData('user_identification', e.target.value)
                  }
                  styles={inputBoxWidth}
                  labelstyles={labelstyles}
                  required
                  withToggle
                />
              </div>
            )}

            <div className="my-3">
              <InputBox
                type="text"
                label="Depart Code"
                id="manual_depart_private_code"
                placeholder="Enter Depart code"
                value={departVehicleData.depart_code || ''}
                onChange={async (e) => {
                  updateUserData('depart_code', e.target.value);
                  await getParkingInfo(
                    departVehicleData.slot,
                    departVehicleData.vehicle_type,
                    e.target.value,
                  );
                }}
                styles={inputBoxWidth}
                labelstyles={labelstyles}
                required
                withToggle
              />
            </div>

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
              isDefault={type === 'slot_card'}
              defaultSelectedValue={departVehicleData.vehicle_type}
              disabled={type === 'slot_card'}
              onChange={async (v) => {
                updateUserData('vehicle_type', v);
                await getParkingInfo(
                  departVehicleData.slot,
                  v?.toString(),
                  departVehicleData.depart_code,
                );
              }}
            />
            {departVehicleData.vehicle_type?.length > 0 && (
              <Dropdown
                label="Slot Number"
                placeholder="Slot Number"
                options={
                  departVehicleData.vehicle_type === 'bike'
                    ? availableSlots.bike_slots.map((s) => ({
                        value: s,
                        name: s.toString(),
                      }))
                    : availableSlots.car_slots.map((s) => ({
                        value: s,
                        name: s.toString(),
                      }))
                }
                styles={'mt-4'}
                labelstyles={labelstyles}
                selectedTextStyles=""
                isDefault={type === 'slot_card'}
                defaultSelectedValue={departVehicleData.slot}
                disabled={type === 'slot_card'}
                onChange={async (v) => {
                  updateUserData('slot', v);
                  await getParkingInfo(
                    Number(v),
                    departVehicleData.vehicle_type,
                    departVehicleData.depart_code,
                  );
                }}
              />
            )}

            <div className="mt-5 grid grid-cols-2">
              <CustomCheckbox
                textFalse="Differnet User"
                textTrue="Differnet User"
                labelStyle="text-md"
                onChange={(v) => updateUserData('is_diff_user', v)}
              />
              <CustomCheckbox
                textFalse="Register user"
                textTrue="Register user"
                labelStyle="text-md"
                onChange={(v) => updateUserData('register', v)}
              />
            </div>

            <div>
              <DepartButton
                data={{
                  user_identification: departVehicleData.user_identification,
                  register: departVehicleData.register,
                  is_diff_user: departVehicleData.is_diff_user,
                  vehicle_type: departVehicleData.vehicle_type,
                  depart_code: departVehicleData.depart_code,
                  slot: departVehicleData.slot,
                }}
                text="Depart Vehicle"
              />
            </div>
          </div>
        ) : (
          <div>
            <QRScanner />
          </div>
        )}
      </div>
      <Popup
        isOpen={showPopupInfo}
        onClose={() => setShowPopupInfo(false)}
        width={300}
        height={150}
        rounded="rounded-lg"
        closable
      >
        <div className="p-4">
          <div>
            <div className="flex gap-2 text-gray-700 text-lg">
              <span className="font-medium">Parked By:</span>
              <span className="font-semibold">
                {TitleCase(parkingInfo?.parked_user_name.toString() || '')}
              </span>
            </div>

            <div className="pt-2">
              <span className="text-6xl font-bold text-gray-900 tracking-tight flex justify-center">
                ₹{parkingInfo?.parking_price}
              </span>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
}
