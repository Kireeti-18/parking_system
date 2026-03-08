'use client';

import { useEffect, useState } from 'react';
import { useDidMountDebounce } from './states/useDidMountDebounce';
import { InputBox } from './InputBox';
import { get_location, loaderAtom } from '@parking/services';
import { getNearestParkings } from '../lib/actions/parking_info';
import { ParkingsType } from '@parking/validations';
import { useLocation } from './states/useLocation';
import { Icon } from './Icons';
import OutsideClickHandler from 'react-outside-click-handler/build/OutsideClickHandler.js';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import ParkingStatusCard from './ParkingStatusCard';

const UserSearch = () => {
  const [query, setQuery] = useState('');
  const { location } = useLocation();
  const [parkings, setParkings] = useState<ParkingsType>([]);
  const [open, setOpen] = useState(false);
  const setLoader = useSetAtom(loaderAtom);
  const router = useRouter();

  const inputBoxWidth =
    'w-[150px] sm:w-md border-gray-300/50 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:border-gray-300/50 p-2 placeholder:text-[14px]';

  useDidMountDebounce(
    () => {
      if (query?.length > 0) {
        getParkingsHandler(location);
        // resetInterval();
      }
    },
    500,
    [query],
  );

  async function getParkingsHandler(loc: { lat: any; lng: any }) {
    if (loc.lat > 0 && loc.lng > 0 && query?.length > 0) {
      const parkings = await getNearestParkings(
        loc.lat,
        loc.lng,
        5,
        1000,
        query,
      );
      setParkings(parkings);
    }
  }

  const onClickHandler = (id: string) => {
    setLoader(true);
    setOpen(false);
    router.push(`/parking/${id}`);
  };

  useEffect(() => {
    getParkingsHandler(location);
  }, [location.lat, location.lng]);

  useEffect(() => {
    const fetchInitialLocation = async () => {
      const initialLocation = await get_location();
      getParkingsHandler(initialLocation);
    };

    fetchInitialLocation();
  }, []);

  return (
    <div className="relative">
      <InputBox
        type="text"
        id="user_search"
        placeholder="Search Parking"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onClick={() => {
          setOpen(true);
        }}
        styles={inputBoxWidth}
        required
        withToggle
      />
      <OutsideClickHandler
        onOutsideClick={() => {
          setOpen(false);
        }}
      >
        {open &&
          query.length > 0 &&
          (parkings.length === 0 ? (
            <div className="absolute mt-2 z-50 w-full max-w-md rounded-xl bg-white shadow-lg px-3 py-2 text-sm text-gray-500">
              No parking found
            </div>
          ) : (
            parkings.length > 0 && (
              <div className="absolute mt-2 z-50 w-full max-w-[260px] sm:max-w-md rounded-xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
                {parkings.map((p) => (
                  <div
                    key={p.parking_area_id}
                    title={p.parking_area_name}
                    className="group flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition hover:bg-gray-50"
                    onClick={() => {
                      onClickHandler(p.parking_area_id);
                    }}
                  >
                    <span className="truncate font-medium text-gray-800 group-hover:text-gray-900">
                      {p.parking_area_name}
                    </span>

                    <div className="flex items-center gap-3 shrink-0">
                      <ParkingStatusCard
                        type="type-2"
                        parkingId={p.parking_area_id}
                        isOpen={p.is_opened}
                      />
                      <div className="flex items-center gap-1 text-xs">
                        <Icon name="bike" styles="text-primary text-sm" />
                        <span className="font-semibold text-green-600">
                          {p.available_bike_slots}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs">
                        <Icon name="car" styles="text-secondaryL text-sm" />
                        <span className="font-semibold text-green-600">
                          {p.available_car_slots}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ))}
      </OutsideClickHandler>
    </div>
  );
};

export default UserSearch;
