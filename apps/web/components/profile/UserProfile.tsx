'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import clsx from 'clsx';
import { Icon } from '../Icons';
import Profile from './ProfilePage';
import MyParkings from './MyParkings';
import Parking from './Parkings';
import Settings from './Settings';
import { useSearchParams } from 'next/navigation';

const UserProfile = () => {
  const searchParams = useSearchParams();

  const validTabs = ['profile', 'settings'];

  const session = useSession();

  const profileData = session.data?.user;

  if (profileData?.user_type == 'admin') {
    validTabs.push('areas');
  } else if (profileData?.user_type == 'user') {
    validTabs.push('parkings');
  }

  const tabParam = searchParams.get('tab') ?? '';
  const tab = validTabs.includes(tabParam) ? tabParam : 'profile';

  const [selected, setSelected] = useState(tab);
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-50 px-4 py-6 h-full">
      <div className="max-w-6xl mx-auto h-full overflow-auto">
        <div className="lg:hidden flex items-center justify-between mb-4">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg bg-white shadow-sm"
          >
            <Icon name="bar-3" />
          </button>
          <h1 className="text-lg font-semibold">Profile</h1>
          <div />
        </div>

        <div className="flex gap-6">
          <div className="hidden lg:block">
            <SideMenu
              userType={profileData?.user_type}
              selected={selected}
              onClick={setSelected}
            />
          </div>

          <div className="flex-1">
            {selected === 'profile' && <Profile profileData={profileData} />}
            {selected === 'parkings' && <MyParkings />}
            {selected === 'areas' && <Parking />}
            {selected === 'settings' && <Settings />}
          </div>
        </div>
      </div>

      <div
        className={clsx(
          'fixed inset-0 z-50 transition',
          open ? 'visible' : 'invisible',
        )}
      >
        <div
          className={clsx(
            'absolute inset-0 bg-black/40 transition-opacity',
            open ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setOpen(false)}
        />

        <div
          className={clsx(
            'absolute left-0 top-0 h-full bg-white shadow-xl transform transition-transform duration-300',
            open ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <SideMenu
            userType={profileData?.user_type}
            selected={selected}
            onClick={(val) => {
              setSelected(val);
              setOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

const SideMenu = ({
  userType,
  selected,
  onClick,
}: {
  userType: string | undefined;
  selected: string;
  onClick: (val: string) => void;
}) => {
  const menuItems = [
    { key: 'profile', label: 'Profile' },
    ...(userType === 'user' ? [{ key: 'parkings', label: 'My Parkings' }] : []),
    ...(userType === 'admin' ? [{ key: 'areas', label: 'Parking Areas' }] : []),
    { key: 'settings', label: 'Settings' },
  ];

  return (
    <div className="h-full bg-white w-64 p-5">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onClick(item.key)}
            className={clsx(
              'w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer',
              selected === item.key
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
