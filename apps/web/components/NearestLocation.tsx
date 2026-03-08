'use client';

import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';

import { useLocation } from './states/useLocation';
import { getNearestParkings } from '../lib/actions/parking_info';
import { ParkingsType } from '@parking/validations';
import { loaderAtom, TitleCase, TitleCaseA } from '@parking/services';
import { Icon } from './Icons';
import { useRouter } from 'next/navigation';
import ParkingStatusCard from './ParkingStatusCard';
import { useSession } from 'next-auth/react';
import LoadingSpinner from './LoadingSpinner';

export const NearestLocation = () => {
  const { location } = useLocation();
  const setLoader = useSetAtom(loaderAtom);
  const [nearestParkings, setNearestParkings] = useState<ParkingsType>([]);
  const router = useRouter();

  const sessionData = useSession();

  const getParkings = async () => {
    if (location.lat && location.lng) {
      const settings = sessionData.data?.settings;

      if (!settings) {
        setNearestParkings([]);
      } else {
        const parkings = await getNearestParkings(
          location.lat,
          location.lng,
          settings.nearestCount,
          settings.nearestDistance,
        );
        setNearestParkings(parkings);
      }
    }
  };

  const onClickHandler = (id) => {
    setLoader(true);

    router.push(`/parking/${id}`);
  };

  useEffect(() => {
    if (
      sessionData.status === 'unauthenticated' ||
      sessionData.status === 'loading'
    ) {
      return;
    }

    getParkings();
  }, [location.lat, location.lng, sessionData.status]);

  return (
    <>
      {nearestParkings.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-2xl overflow-x-auto">
          <div className="text-xl text-gray-900 font-bold">
            Nearest Parkings
          </div>
          <div className="flex gap-4 w-full mt-2">
            {sessionData.status === 'unauthenticated' ||
            sessionData.status === 'loading' ? (
              <div className="flex justify-center items-center">
                <LoadingSpinner />
              </div>
            ) : (
              nearestParkings.map((m) => (
                <div
                  key={m.parking_area_id}
                  className="min-w-[240px] bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-5">
                    <div
                      title={TitleCase(m.parking_area_name)}
                      className="text-md font-semibold text-gray-800 truncate text-center cursor-default w-[100%]"
                    >
                      {TitleCase(m.parking_area_name)}
                    </div>
                    <ParkingStatusCard
                      type="type-2"
                      parkingId={m.parking_area_id}
                      isOpen={m.is_opened}
                    />

                    <div
                      className="cursor-pointer"
                      onClick={() => onClickHandler(m.parking_area_id)}
                    >
                      <Icon
                        name="arrow-long-right"
                        styles="text-secondaryL font-semibold"
                      />
                    </div>
                  </div>

                  <div
                    title={TitleCaseA(
                      (m.other_parking_info?.address || '').split(','),
                    )}
                    className="text-xs text-gray-500 text-center truncate cursor-default"
                  >
                    {TitleCaseA(
                      (m.other_parking_info?.address || '').split(','),
                    )}
                  </div>

                  <div className="flex justify-center">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-600 font-medium">
                      {(m?.distance || 0).toFixed(2)} KM away
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Icon name="bike" styles="text-primary text-base" />
                        <span>Bike</span>
                      </div>
                      <div className="text-right">
                        <span className="text-green-600 font-semibold">
                          {m.available_bike_slots}
                        </span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-gray-700">
                          {m.bike_pricing} / {m.pricing_type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Icon name="car" styles="text-secondary text-base" />
                        <span>Car</span>
                      </div>
                      <div className="text-right">
                        <span className="text-green-600 font-semibold">
                          {m.available_car_slots}
                        </span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-gray-700">
                          {m.car_pricing} / {m.pricing_type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};
