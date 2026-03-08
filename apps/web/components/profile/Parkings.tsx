'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { PricingType } from '@parking/validations';
import ParkingActions from '../ParkingPageActions';
import { UpdateParkingDetails } from '../../lib/actions/parking_info';
import { useShowAlert } from '@parking/services';
import { Dropdown } from '../Dropdown';

type ParkingType = {
  parking_area_id: string;
  parking_area_name: string;
  car_price_per_hour: number;
  bike_price_per_hour: number;
  pricing_type: string;
  is_opened: boolean;
};

type EditViewProps = {
  parkingInfo: ParkingType;
  onCancel: () => void;
  onUpdate: (updated: ParkingType) => Promise<boolean>;
};

const EditParkingView = ({
  parkingInfo,
  onCancel,
  onUpdate,
}: EditViewProps) => {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(parkingInfo.parking_area_name);
  const [pricingType, setPricingType] = useState(parkingInfo.pricing_type);

  const [carPrice, setCarPrice] = useState<string>(
    Number(parkingInfo.car_price_per_hour).toFixed(2),
  );
  const [bikePrice, setBikePrice] = useState<string>(
    Number(parkingInfo.bike_price_per_hour).toFixed(2),
  );

  const handleSave = async () => {
    try {
      setLoading(true);

      const updated: ParkingType = {
        parking_area_id: parkingInfo.parking_area_id,
        parking_area_name: name,
        car_price_per_hour: parseFloat(carPrice) || 0,
        bike_price_per_hour: parseFloat(bikePrice) || 0,
        pricing_type: pricingType,
        is_opened: parkingInfo.is_opened,
      };

      const isUpdated = await onUpdate(updated);
      if (isUpdated) {
        onCancel();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="text-sm font-medium text-gray-500 hover:text-primary transition cursor-pointer"
          >
            ← Back
          </button>
        </div>
      </div>
      <div className="text-xl px-6 text-gray-800">Edit Parking Area</div>

      <div className="flex-1 max-w-4xl mx-auto p-6 w-full">
        <div className="relative rounded-3xl border border-gray-100 bg-white p-10 shadow-[0_6px_12px_rgba(0,0,0,0.06)]">
          <div className="space-y-8 mt-4">
            <FormInput label="Parking Name" value={name} onChange={setName} />

            <FormInput
              label="Car Price (₹ / hour)"
              type="number"
              step="0.01"
              value={carPrice}
              onChange={setCarPrice}
            />

            <FormInput
              label="Bike Price (₹ / hour)"
              type="number"
              step="0.01"
              value={bikePrice}
              onChange={setBikePrice}
            />

            <div>
              <Dropdown
                label="Pricing Type"
                labelstyles="block text-sm font-medium text-gray-700 mb-2"
                options={Object.values(PricingType).map((type) => ({
                  value: type,
                  name: type,
                }))}
                isDefault={true}
                defaultSelectedValue={pricingType}
                onChange={(value) => setPricingType(String(value))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 text-sm rounded-xl text-white bg-primary hover:opacity-90 transition shadow-md disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

type FormInputProps = {
  label: string;
  value: string | number;
  type?: string;
  step?: string;
  onChange: (v: string) => void;
};

const FormInput = ({
  label,
  value,
  type = 'text',
  step,
  onChange,
}: FormInputProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
    />
  </div>
);

const Parking = () => {
  const { data: session, update } = useSession();
  const [editing, setEditing] = useState<ParkingType | null>(null);
  const [parkingData, setParkingData] = useState<ParkingType[]>(
    session?.parking_info?.parking_data || [],
  );
  const showAlert = useShowAlert();
  const sessionData = useSession();
  const userInfo = sessionData.data?.user;

  if (editing) {
    return (
      <EditParkingView
        parkingInfo={editing}
        onCancel={() => setEditing(null)}
        onUpdate={async (updated) => {
          const res = await UpdateParkingDetails({
            parkingId: updated.parking_area_id,
            parkingName: updated.parking_area_name,
            pricingType: updated.pricing_type,
            carPricePerHour: updated.car_price_per_hour,
            bikePricePerHour: updated.bike_price_per_hour,
          });

          if (res.status !== 200) {
            showAlert(res.message || 'Could not update parking details', 'failed');
            return false;
          }

          setParkingData((prev) =>
            prev.map((p) =>
              p.parking_area_id === updated.parking_area_id ? updated : p,
            ),
          );

          const currentParkingInfo = session?.parking_info;
          if (currentParkingInfo?.parking_data) {
            await update({
              parking_info: {
                ...currentParkingInfo,
                parking_data: currentParkingInfo.parking_data.map((p) =>
                  p.parking_area_id === updated.parking_area_id
                    ? {
                        ...p,
                        parking_area_name: updated.parking_area_name,
                        pricing_type: updated.pricing_type,
                        car_price_per_hour: updated.car_price_per_hour,
                        bike_price_per_hour: updated.bike_price_per_hour,
                      }
                    : p,
                ),
              },
            });
          }

          showAlert('Parking details updated successfully', 'success');
          return true;
        }}
      />
    );
  }

  return (
    <div className="h-full bg-[#f9fbfc]">
      <div className="h-full max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-4">
          Parking Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {parkingData.map((p) => (
            <div
              key={p.parking_area_id}
              className="group relative bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-400">
                    Parking Area
                  </div>
                  <div className="text-xl font-semibold text-gray-900 mt-1">
                    {p.parking_area_name}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <ParkingActions
                    isOpened={p.is_opened}
                    parkingId={p.parking_area_id}
                    userInfo={{ email: userInfo?.email || '' }}
                    type="status"
                  />

                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary text-center">
                    {p.pricing_type}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <PriceRow label="Car" price={p.car_price_per_hour} />
                <PriceRow label="Bike" price={p.bike_price_per_hour} />
              </div>

              <button
                onClick={() => setEditing(p)}
                className="mt-4 w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:border-primary hover:text-primary transition cursor-pointer"
              >
                Manage Parking
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PriceRow = ({ label, price }: { label: string; price: number }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className="text-lg font-semibold text-secondary">
      ₹ {Number(price)?.toFixed(2)}
    </span>
  </div>
);

export default Parking;
