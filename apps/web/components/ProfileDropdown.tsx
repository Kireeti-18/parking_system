'use client';

import { useState, useEffect, useRef } from 'react';
import { DefaultAvatar, Icon, Avatar } from './components';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { loaderAtom, TitleCase } from '@parking/services';

export default function ProfileDropdown() {
  const { data, update, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const userInfo = (isAuthenticated ? data.user || {} : {}) as any;
  const parkingInfo = (
    isAuthenticated
      ? userInfo?.user_type === 'admin'
        ? data?.parking_info || {}
        : {}
      : {}
  ) as any;
  const currentParkingIndex = parkingInfo.current_parking_index || 0;
  const setLoader = useSetAtom(loaderAtom);
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const signoutHandler = async () => {
    await signOut({ callbackUrl: '/signin' });
  };

  const updateSessionHandler = async (index: number) => {
    await update({ current_parking_index: index });
    setIsOpen(false);
    router.refresh();
  };

  const redirectToParking = (id: string) => {
    setLoader(true);
    setIsOpen(false);
    router.push(`/parking/${id}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) return <></>;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center text-sm pe-1 pr-2 font-medium text-gray-800 rounded-full hover:text-primary focus:ring-4 focus:ring-gray-100"
        type="button"
      >
        {userInfo?.avathar?.length > 0 ? (
          <Avatar avathar={userInfo?.avathar}></Avatar>
        ) : (
          <DefaultAvatar name={userInfo?.name} />
        )}

        {TitleCase(userInfo.name)}
        <Icon name="bottom-arrow" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white  rounded-lg shadow-md z-10">
          <div className="px-4 py-3 text-sm text-gray-800 border-b-3 border-b-gray-100">
            <div className="truncate">{userInfo.email}</div>
          </div>
          <ul
            className={`py-2 text-sm text-gray-800 ${userInfo?.user_type !== 'admin' && 'border-b-3 border-b-gray-100'}`}
          >
            <li>
              <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                Profile
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                Settings
              </a>
            </li>
          </ul>
          {userInfo?.user_type === 'admin' && (
            <>
              <div className="relative mb-1">
                <div className="border-t-3 border-gray-100"></div>
                <span className="absolute left-1/2 -top-2 -translate-x-1/2 bg-white px-2 text-xs font-semibold text-gray-700">
                  Parkings
                </span>
              </div>

              <ul className="py-2 text-sm text-gray-800 border-b-3 border-b-gray-100">
                {(parkingInfo?.parking_data || []).map((p, ind: number) => (
                  <li key={p?.parking_area_id || ind}>
                    <div
                      className={`block cursor-pointer ${currentParkingIndex === ind && 'bg-primary/5'}`}
                    >
                      <div className="flex w-[100%]">
                        <div
                          className={`w-[100%] pl-4 py-2 truncate ${currentParkingIndex !== ind && 'hover:bg-gray-100'}`}
                          title={p?.parking_area_name}
                          onClick={() => {
                            if (currentParkingIndex !== ind) {
                              updateSessionHandler(ind);
                            }
                          }}
                        >
                          {p?.parking_area_name}
                        </div>
                        <div
                          className={`p-2 ${currentParkingIndex !== ind && 'hover:bg-primary/5'}`}
                          onClick={() => redirectToParking(p?.parking_area_id)}
                        >
                          <Icon name="chevron" styles="text-primary" />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="py-2">
            <div
              className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
              onClick={signoutHandler}
            >
              <div className="flex gap-2 items-center">
                <Icon name="logout" size="4" styles="text-orange-500" />
                Log out
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
