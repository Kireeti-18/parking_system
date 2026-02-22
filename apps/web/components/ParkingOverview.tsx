import { ParkingInfoHashType } from '@parking/validations';
import { ParkingSlotCard } from './ParkingSlotCard';

export type SlotStatus =
  | 'available'
  | 'occupied'
  | 'maintenance'
  | 'reserved'
  | 'departed';

type SlotStyle = {
  outerDiv: string;
  innerDiv: string;
  inputDiv: string;
  button: string;
};

export const slotStyles: Record<SlotStatus, SlotStyle> = {
  available: {
    outerDiv: 'border-green-600 bg-green-50',
    innerDiv: 'bg-sky-500 text-white',
    inputDiv: 'border-green-600',
    button: 'bg-green-500',
  },
  occupied: {
    outerDiv: 'border-red-600 bg-red-50',
    innerDiv: 'bg-blue-500 text-white',
    inputDiv: 'border-red-600',
    button: 'bg-red-500',
  },
  maintenance: {
    outerDiv: 'border-purple-600 bg-purple-100',
    innerDiv: 'bg-orange-300',
    inputDiv: 'border-purple-600',
    button: 'bg-purple-500',
  },
  reserved: {
    outerDiv: 'border-blue-600 bg-blue-50',
    innerDiv: 'bg-yellow-200',
    inputDiv: 'border-blue-600',
    button: 'bg-blue-500',
  },
  departed: {
    outerDiv: '',
    innerDiv: '',
    inputDiv: '',
    button: '',
  },
};

export function getSlotStyles(slotStatus: unknown): SlotStyle {
  if (typeof slotStatus === 'string' && slotStatus in slotStyles) {
    return slotStyles[slotStatus as SlotStatus];
  }
  return { outerDiv: '', innerDiv: '', inputDiv: '', button: '' };
}

export function ParkingOverview({
  parkingSlotsInfo,
}: {
  parkingSlotsInfo: {
    status: number;
    bike_slots: Record<number, ParkingInfoHashType>;
    car_slots: Record<number, ParkingInfoHashType>;
  };
}) {
  return (
    <div className="my-10 mx-6 relative py-10 px-6 rounded-2xl shadow-md bg-white">
      <div className="text-gray-900 mb-2 text-2xl tracking-[0.5px] font-semibold leading-relaxed">
        Parking Slots Overview
      </div>
      <div className="flex justify-center gap-5 flex-wrap">
        <div className="flex gap-2 items-center">
          <div
            className={`h-4 w-4 border-3 rounded-sm ${slotStyles.available.outerDiv}`}
          ></div>
          Available
        </div>
        <div className="flex gap-2 items-center">
          <div
            className={`h-4 w-4 border-3 rounded-sm ${slotStyles.occupied.outerDiv}`}
          ></div>
          Occupied
        </div>
        <div className="flex gap-2 items-center">
          <div
            className={`h-4 w-4 border-3 rounded-sm ${slotStyles.reserved.outerDiv}`}
          ></div>
          Reserved
        </div>
        <div className="flex gap-2 items-center">
          <div
            className={`h-4 w-4 border-3 rounded-sm ${slotStyles.maintenance.outerDiv}`}
          ></div>
          Maintenance
        </div>
      </div>
      <div className="flex justify-center mt-3 text-gray-700 mb-5 text-xl tracking-[0.5px] font-semibold leading-relaxed">
        Bike Slots
      </div>
      <div className="my-5 mx-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 xl:gap-8">
        {Object.entries(parkingSlotsInfo.bike_slots).map(([i, slot]) => (
          <ParkingSlotCard
            key={i}
            slotName={`B${i}`}
            slotNumber={i}
            slotStatus={slot.status}
            slotType="bike"
            parkingId={slot.status === 'available' ? '#' : slot?.parking_id}
            slotInfo={slot}
          />
        ))}
      </div>
      <div className="flex justify-center mt-3 text-gray-700 mb-5 text-xl tracking-[0.5px] font-semibold leading-relaxed">
        Car Slots
      </div>
      <div className="my-5 mx-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 xl:gap-8">
        {Object.entries(parkingSlotsInfo.car_slots).map(([i, slot]) => (
          <ParkingSlotCard
            key={i}
            slotName={`C${i}`}
            slotNumber={i}
            slotStatus={slot.status}
            slotType="car"
            parkingId={slot.status === 'available' ? '#' : slot?.parking_id}
            slotInfo={slot}
          />
        ))}
      </div>
    </div>
  );
}
