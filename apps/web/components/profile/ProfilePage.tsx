'use client';

import { useState, useEffect } from 'react';
import { Avatar } from '../Avathar';
import { DefaultAvatar } from '../DefaultAvathar';
import { TitleCase } from '@parking/services';
import clsx from 'clsx';
import Image from 'next/image';
import { updateUserInfo } from '../../lib/actions/user';
import { useSession } from 'next-auth/react';
import { loaderAtom } from '@parking/services';
import { useSetAtom } from 'jotai';

const AVATARS = [
  'boy-1',
  'boy-2',
  'boy-3',
  'boy-4',
  'girl-1',
  'girl-2',
  'girl-3',
  'girl-4',
  'men-1',
  'men-2',
  'men-3',
  'men-4',
  'women-1',
  'women-2',
  'women-3',
  'women-4',
  'zgrandM-1',
  'zgrandM-2',
  'zgrandM-3',
  'zgrandM-4',
  'zgrandW-1',
  'zgrandW-2',
  'zgrandW-3',
  'zgrandW-4',
];

const Profile = ({ profileData }: any) => {
  const [editing, setEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('boy-1');

  const { update } = useSession();
  const setLoader = useSetAtom(loaderAtom);

  useEffect(() => {
    if (profileData) {
      setName(profileData?.name || '');
      setAvatar(profileData?.avathar || 'boy-1');
    }
  }, [profileData]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setName(profileData?.name || '');
    setAvatar(profileData?.avathar || 'boy-1');
    setEditing(false);
    setShowAvatarModal(false);
  };

  const handleSave = async () => {
    setLoader(true);
    try {
      await updateUserInfo({ name, avatar });
      await update({ name, avatar });
      setEditing(false);
    } catch (e) {
      console.log('profile update failed', e);
    }
    setLoader(false);
  };

  return (
    <div className="relative bg-white rounded-3xl shadow-md p-10 w-full max-w-xl mx-auto">
      <button
        onClick={editing ? handleCancel : handleEdit}
        className="absolute top-6 right-6 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
      >
        {editing ? 'Cancel' : 'Edit'}
      </button>

      <div className="flex flex-col items-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-blue-50 blur-2xl opacity-60" />

          <div
            className="relative cursor-pointer"
            onClick={() => editing && setShowAvatarModal(true)}
          >
            {avatar ? (
              <Avatar avathar={avatar} size="30" />
            ) : (
              <DefaultAvatar name={name} size="40" />
            )}

            {editing && (
              <div className="absolute bottom-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-full cursor-pointer">
                Edit
              </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-md space-y-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">
              Name
            </div>

            {editing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="text-xl font-semibold text-gray-900">
                {TitleCase(name)}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">
              Email
            </div>
            <div className="text-lg font-medium text-gray-800">
              {profileData?.email}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">
              User Type
            </div>
            <div className="text-lg font-medium text-gray-800">
              {TitleCase(profileData?.user_type)}
            </div>
          </div>

          {editing && (
            <div className="pt-6">
              <button
                onClick={handleSave}
                className="w-full bg-primary/80 text-white py-3 rounded-xl font-semibold hover:bg-primary cursor-pointer transition"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowAvatarModal(false)}
          />

          <div className="relative bg-white rounded-3xl p-6 max-w-3xl w-full shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Select Avatar</h3>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 max-h-[400px] overflow-y-auto">
              {AVATARS.map((a) => (
                <div
                  key={a}
                  onClick={() => {
                    setAvatar(a);
                    setShowAvatarModal(false);
                  }}
                  className={clsx(
                    'cursor-pointer rounded-full p-1 border-2 transition',
                    avatar === a
                      ? 'border-secondary'
                      : 'border-transparent hover:border-gray-300',
                  )}
                >
                  <Image
                    className="rounded-full"
                    src={`/avathars/${a}.png`}
                    alt={a}
                    width={100}
                    height={100}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
