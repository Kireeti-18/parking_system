'use client';

import { useEffect, useRef, useState } from 'react';
import { getUserBookedParkings } from '../../lib/actions/user';
import type { Parkings } from '../../../../packages/db/generated/prisma';
import { loaderAtom } from '@parking/services';
import { useSetAtom } from 'jotai';
import { Dropdown } from '../Dropdown';
import { useRouter } from 'next/navigation';

type Parking = Parkings & { parkingArea: { name: string } };
type ParkingStatusFilter = '' | 'occupied' | 'departed' | 'reserved';

const StatusBadge = ({ status }: { status: string }) => {
  const getStyles = () => {
    if (status === 'occupied') return 'bg-green-50 text-green-600';
    if (status === 'departed') return 'bg-gray-100 text-gray-600';
    if (status === 'reserved') return 'bg-yellow-50 text-yellow-600';

    return 'bg-blue-50 text-blue-600';
  };

  return (
    <span
      className={`text-xs font-medium px-3 py-1 rounded-full ${getStyles()}`}
    >
      {status}
    </span>
  );
};

const MyParkings = ({
  defaultStatusFilter = '',
  dashboardMode = false,
}: {
  defaultStatusFilter?: ParkingStatusFilter;
  dashboardMode?: boolean;
}) => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    defaultStatusFilter || undefined,
  );
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const secondLastItemRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const setLoader = useSetAtom(loaderAtom);
  const router = useRouter();

  useEffect(() => {
    setStatusFilter(defaultStatusFilter || undefined);
  }, [defaultStatusFilter]);

  useEffect(() => {
    const loadInitial = async () => {
      setLoader(true);
      setPage(1);
      setHasMore(true);

      const data = await getUserBookedParkings(1, statusFilter);
      setParkings(data);
      setHasMore(data.length === 5);

      setLoader(false);
    };

    loadInitial();
  }, [statusFilter]);

  useEffect(() => {
    if (page === 1) return;

    const loadMore = async () => {
      setLoadingMore(true);

      const data = await getUserBookedParkings(page, statusFilter);

      if (!data.length) {
        setHasMore(false);
      } else {
        setParkings((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const filtered = data.filter((p) => !existingIds.has(p.id));
          return [...prev, ...filtered];
        });
      }

      setLoadingMore(false);
    };

    loadMore();
  }, [page]);

  useEffect(() => {
    if (dashboardMode) return;

    const container = scrollContainerRef.current;
    const targetEl = secondLastItemRef.current;

    if (!container || !targetEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting && hasMore && !loadingMore) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: container,
        rootMargin: '100px',
        threshold: 0,
      },
    );

    observer.observe(targetEl);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadingMore, parkings.length, dashboardMode]);

  const redirectToManage = () => {
    setLoader(true);
    router.push('/profile?tab=parkings');
  };

  const Parking = ({ parking }) => {
    const [showId, setShowId] = useState(false);

    return (
      <div
        key={parking.id}
        className={
          dashboardMode
            ? 'bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4'
            : 'bg-gray-50 rounded-2xl p-5 hover:shadow-md transition'
        }
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-xs text-gray-400 uppercase">Parking Area</div>
            <div className="text-lg font-semibold text-gray-900 capitalize truncate">
              {parking.parkingArea?.name || 'Unknown Area'}
            </div>
          </div>

          <StatusBadge status={parking.status} />
        </div>

        <div className="border-t border-gray-200 pt-3 text-sm text-gray-600 flex justify-between">
          <div>
            <div className="text-xs text-gray-400 uppercase">Booked On</div>
            <div>{new Date(parking.createdAt).toLocaleDateString()}</div>
          </div>
          {parking.status === 'departed' && (
            <div>
              <div className="text-xs text-gray-400 uppercase">Departed On</div>
              <div className="flex justify-end">
                {new Date(parking.depature_time_stamp).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
        {parking.status !== 'departed' && (
          <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-400 uppercase">Parking ID</div>

              <div
                className={`text-sm font-medium transition ${
                  showId ? '' : 'blur-sm select-none'
                }`}
              >
                #{parking.private_id}
              </div>
            </div>

            <button
              onClick={() => setShowId((prev) => !prev)}
              className="text-xs px-3 py-1 rounded-lg bg-primary/80 text-white hover:bg-primary transition cursor-pointer"
            >
              {showId ? 'Hide' : 'Show'}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={
        dashboardMode
          ? 'p-4 bg-gray-50 rounded-2xl'
          : 'bg-white rounded-3xl shadow-md p-6 w-full h-full'
      }
    >
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">My Parkings</h2>
        {dashboardMode ? (
          <button
            onClick={redirectToManage}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:opacity-90 transition cursor-pointer"
          >
            Manage
          </button>
        ) : (
          <div className="w-[200px]">
            <Dropdown
              label=""
              placeholder=""
              options={[
                { value: '', name: 'All' },
                { value: 'occupied', name: 'Occupied' },
                { value: 'departed', name: 'Departed' },
                { value: 'reserved', name: 'Reserved' },
              ]}
              isDefault={true}
              defaultSelectedValue={defaultStatusFilter}
              onChange={(v) => {
                setStatusFilter(
                  typeof v === 'string' ? v || undefined : undefined,
                );
              }}
            />
          </div>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        className={
          dashboardMode
            ? 'flex gap-4 w-full overflow-x-auto pb-5'
            : 'h-[calc(100vh-250px)] overflow-y-auto space-y-6 pr-2'
        }
      >
        {!parkings.length && !hasMore && (
          <div className="text-center py-10 text-gray-500">
            No parking records found.
          </div>
        )}

        {parkings.map((parking, index) => {
          const triggerIndex =
            parkings.length > 1 ? parkings.length - 2 : parkings.length - 1;
          const isTriggerItem = index === triggerIndex;

          return (
            <div
              key={parking.id}
              ref={isTriggerItem ? secondLastItemRef : null}
              className={dashboardMode ? 'min-w-[280px]' : ''}
            >
              <Parking parking={parking} />
            </div>
          );
        })}

        {!dashboardMode && hasMore && (
          <div className="text-center py-6 text-sm text-gray-400">
            {loadingMore ? 'Loading more...' : 'Scroll to load more'}
          </div>
        )}

        {!dashboardMode && !hasMore && parkings.length > 0 && (
          <div className="text-center py-6 text-sm text-gray-400">
            No more parkings
          </div>
        )}
      </div>
    </div>
  );
};

export default MyParkings;
