'use client';

import { parkingFilterAtom } from '@parking/services';
import BooleanToggler from './BooleanToggler';
import { useAtom } from 'jotai';

export function ParkingFilter() {
  const [filter, setFilter] = useAtom(parkingFilterAtom);

  return (
    <BooleanToggler
      value={filter === 'nearest'}
      onToggle={(v: boolean) => {
        if (v) setFilter('nearest');
        else setFilter('search');
      }}
    />
  );
}
