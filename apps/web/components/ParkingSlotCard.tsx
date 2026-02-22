'use client';

import { TitleCase } from '@parking/services';
import { Icon } from './Icons';
import { ClientRouter } from './ClientRoute';
import { Popup } from './Popup';
import { useState } from 'react';
import { getSlotStyles } from './ParkingOverview';
import ManualDepartForm from './ManualDepartForm';
import ManualEntryForm from './ManualEntryForm';
import { useSession } from 'next-auth/react';

interface ParkingCardProps {
  slotName: string;
  slotStatus: any;
  slotType: 'bike' | 'car';
  parkingId: string;
  slotNumber: string;
  slotInfo: object;
}

export const ParkingSlotCard = ({
  slotName,
  slotStatus,
  slotType,
  parkingId,
  slotNumber,
  slotInfo,
}: ParkingCardProps) => {
  const [showDepart, setShowDepart] = useState(false);
  const sessionData = useSession();
  const parkingInfo = sessionData.data?.parking_info;

  return (
    <div
      className={`rounded-lg px-3 pb-4 flex flex-col items-center min-w-[100px] border-3 ${getSlotStyles(slotStatus).outerDiv}`}
    >
      <div className="pt-2 h-4 w-full flex justify-end">
        <div
          onClick={() => {
            setShowDepart(true);
          }}
        >
          <Icon name="three-dots" styles="font-bold cursor-pointer "></Icon>
        </div>
      </div>
      <div>
        <Icon
          name={
            slotStatus === 'reserved'
              ? 'lock'
              : slotStatus === 'maintenance'
                ? 'wrench'
                : slotStatus === 'available'
                  ? 'clock'
                  : slotType
          }
        />
      </div>
      <div className="font-semibold text-lg">{slotName}</div>
      <div
        className={`px-2 rounded-2xl font-semibold ${getSlotStyles(slotStatus).innerDiv}`}
      >
        {parkingId === '#' ? (
          TitleCase(slotStatus)
        ) : (
          <ClientRouter route={`/admin/entry/${parkingId}`}>
            <span className="cursor-pointer"> {TitleCase(slotStatus)}</span>
          </ClientRouter>
        )}
      </div>

      <Popup
        isOpen={showDepart}
        onClose={() => setShowDepart(false)}
        width={`75vh`}
        height={'100%'}
        rounded="rounded-lg"
        closable
      >
        <div className="p-4">
          {(slotStatus === 'occupied' || slotStatus === 'maintenance') && (
            <ManualDepartForm
              options="manual"
              border={false}
              type="slot_card"
              slotNumber={slotNumber}
              slotType={slotType}
              slotStatus={slotStatus}
            />
          )}

          {(slotStatus === 'available' || slotStatus === 'reserved') && (
            <ManualEntryForm
              type="slot_card"
              border={false}
              slotNumber={slotNumber}
              slotType={slotType}
              slotInfo={slotInfo}
              parkingAreaId={
                parkingInfo?.parking_data[parkingInfo.current_parking_index]
                  ?.parking_area_id || ''
              }
            />
          )}
        </div>
      </Popup>
    </div>
  );
};
