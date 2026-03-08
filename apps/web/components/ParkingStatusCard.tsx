'use client';

import { useState, useTransition } from 'react';
import { useUserInfo } from './states/useUserInfo';
import { UpdateParkingStatus } from '../lib/actions/parking_info';
import { useSession } from 'next-auth/react';
import { useSetAtom } from 'jotai';
import { loaderAtom } from '@parking/services';

const ParkingStatusCard = ({
  parkingId,
  isOpen,
  type = 'type-1',
}: {
  parkingId: string;
  isOpen: boolean;
  type?: 'type-1' | 'type-2';
}) => {
  const [open, setOpen] = useState(isOpen);
  const [isPending, startTransition] = useTransition();
  const userTypeInfo = useUserInfo();
  const { update } = useSession();
  const setLoader = useSetAtom(loaderAtom);

  const toggleStatus = (status: boolean) => {
    if (!userTypeInfo.isAdmin) return;
    setLoader(true);
    startTransition(async () => {
      await UpdateParkingStatus(parkingId, status);
      await update({ parking_status: status, parking_id: parkingId });
      setOpen(status);
    });
    setTimeout(() => {
      setLoader(false);
    }, 500);
  };

  const isType1 = type === 'type-1';
  const canToggle = isType1 && userTypeInfo.isAdmin && !isPending;

  return (
    <button
      onClick={() => {
        if (canToggle) toggleStatus(!open);
      }}
      disabled={!canToggle}
      className={
        isType1
          ? `rounded-full px-4 py-1 text-xs font-medium transition ${
              open
                ? `bg-green-200 text-green-700 ${
                    canToggle ? 'hover:bg-green-300 cursor-pointer' : ''
                  }`
                : `bg-red-200 text-red-700 ${canToggle ? 'hover:bg-red-300 cursor-pointer' : ''}`
            }`
          : ''
      }
    >
      {isType1 ? (
        open ? (
          'Open'
        ) : (
          'Closed'
        )
      ) : (
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            open ? 'bg-green-600' : 'bg-red-600'
          }`}
        />
      )}
    </button>
  );
};

export default ParkingStatusCard;
