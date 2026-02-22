'use client';

import { useState, useTransition } from 'react';
import ManualEntryForm from './ManualEntryForm';
import { Popup } from './Popup';
import ParkingStatusCard from './ParkingStatusCard';

type Props = {
  isOpened: boolean;
  parkingId: string;
  userInfo: {
    email: string;
  };
  type: 'book' | 'status';
};

export default function ParkingActions({
  type,
  isOpened,
  parkingId,
  userInfo,
}: Props) {
  const [book, setBook] = useState(false);

  if (type === 'book') {
    return (
      <>
        <button
          className="rounded-xl bg-orange-400/90 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 transition cursor-pointer"
          onClick={() => setBook(true)}
        >
          Book Parking
        </button>
        <Popup
          isOpen={book}
          onClose={() => setBook(false)}
          width={`75vh`}
          height={'100%'}
          rounded="rounded-lg"
          closable
        >
          <ManualEntryForm
            type="reserve"
            border={false}
            slotInfo={{ status: 'reserved', parked_user_email: userInfo.email }}
            userType="user"
            parkingAreaId={parkingId}
          />
        </Popup>
      </>
    );
  }

  if (type === 'status') {
    return <ParkingStatusCard isOpen={isOpened} parkingId={parkingId} />;
  }

  return <></>;
}
