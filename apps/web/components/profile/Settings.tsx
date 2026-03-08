'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useReducer, useState } from 'react';
import { changeUserPassword, updateUserSettings } from '../../lib/actions/user';
import { useShowAlert } from '@parking/services';
import { InputBox } from '../InputBox';

type PasswordState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  loading: boolean;
};

type PasswordAction =
  | { type: 'set_current'; payload: string }
  | { type: 'set_new'; payload: string }
  | { type: 'set_confirm'; payload: string }
  | { type: 'set_loading'; payload: boolean }
  | { type: 'reset' };

const initialPasswordState: PasswordState = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  loading: false,
};

const passwordReducer = (
  state: PasswordState,
  action: PasswordAction,
): PasswordState => {
  switch (action.type) {
    case 'set_current':
      return { ...state, currentPassword: action.payload };
    case 'set_new':
      return { ...state, newPassword: action.payload };
    case 'set_confirm':
      return { ...state, confirmPassword: action.payload };
    case 'set_loading':
      return { ...state, loading: action.payload };
    case 'reset':
      return { ...initialPasswordState };
    default:
      return state;
  }
};

const Settings = () => {
  const [nearestCount, setNearestCount] = useState(5);
  const [nearestDistance, setNearestDistance] = useState(5);
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordState, passwordDispatch] = useReducer(
    passwordReducer,
    initialPasswordState,
  );

  const sessionData = useSession();
  const { update } = sessionData;
  const showAlert = useShowAlert();

  const isAdmin = sessionData.data?.user.user_type == 'admin';

  useEffect(() => {
    const settings = sessionData.data?.settings;
    if (!settings) return;
    setNearestCount(settings.nearestCount ?? 5);
    setNearestDistance(settings.nearestDistance ?? 5);
    setNotifications(settings.notifications ?? true);
  }, [sessionData.data?.settings]);

  const handleSave = async () => {
    setLoading(true);

    const payload = { nearestCount, nearestDistance, notifications };
    const isUpdated = await updateUserSettings(payload);
    if (isUpdated) {
      await update({ settings: payload });
    }
    setLoading(false);
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[a-z]/.test(password))
      return 'Password must contain one lowercase letter';
    if (!/[A-Z]/.test(password))
      return 'Password must contain one uppercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain one number';
    if (!/[^A-Za-z0-9]/.test(password))
      return 'Password must contain one special character';
    return '';
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordState;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showAlert('All password fields are required', 'failed');
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert('New password and confirm password must match', 'failed');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      showAlert(passwordError, 'failed');
      return;
    }

    passwordDispatch({ type: 'set_loading', payload: true });
    const res = await changeUserPassword({ currentPassword, newPassword });
    passwordDispatch({ type: 'set_loading', payload: false });

    if (!res.ok) {
      showAlert(res.error || 'Could not change password', 'failed');
      return;
    }

    passwordDispatch({ type: 'reset' });
    setShowPasswordForm(false);
    showAlert('Password updated successfully', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 p-6 bg-white rounded-2xl">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Configure how nearby parking results are displayed.
        </p>
      </div>
      {!isAdmin && (
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Parking Preferences
          </h2>

          <div className="md:hidden space-y-3">
            <div className="rounded-2xl border border-gray-100 p-4">
              <div className="font-medium text-gray-800">
                Nearest Parkings Count
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Maximum 10 parkings
              </div>
              <input
                type="number"
                min={1}
                max={10}
                value={nearestCount}
                onChange={(e) =>
                  setNearestCount(
                    Math.min(10, Math.max(1, Number(e.target.value))),
                  )
                }
                className="mt-3 w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="rounded-2xl border border-gray-100 p-4">
              <div className="font-medium text-gray-800">
                Nearest Parking Distance (KM)
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Maximum 500 KM radius
              </div>
              <input
                type="number"
                min={1}
                max={500}
                value={nearestDistance}
                onChange={(e) =>
                  setNearestDistance(
                    Math.min(500, Math.max(1, Number(e.target.value))),
                  )
                }
                className="mt-3 w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Preference</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-4 font-medium text-gray-800">
                    Nearest Parkings Count
                  </td>
                  <td className="px-4 py-4 text-gray-500">
                    Maximum 10 parkings
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={nearestCount}
                      onChange={(e) =>
                        setNearestCount(
                          Math.min(10, Math.max(1, Number(e.target.value))),
                        )
                      }
                      className="w-full md:w-48 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </td>
                </tr>

                <tr className="border-t border-gray-100">
                  <td className="px-4 py-4 font-medium text-gray-800">
                    Nearest Parking Distance (KM)
                  </td>
                  <td className="px-4 py-4 text-gray-500">
                    Maximum 500 KM radius
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={nearestDistance}
                      onChange={(e) =>
                        setNearestDistance(
                          Math.min(500, Math.max(1, Number(e.target.value))),
                        )
                      }
                      className="w-full md:w-48 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-10">
            <button
              onClick={handleSave}
              disabled={loading}
              className="p-2 rounded-xl  bg-primary text-white font-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Notifications
        </h2>

        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium text-gray-800">Email Notifications</div>
            <div className="text-sm text-gray-500">
              Receive booking and activity updates.
            </div>
          </div>

          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative w-12 h-6 rounded-full transition ${
              notifications ? 'bg-primary' : 'bg-gray-300'
            } cursor-pointer`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                notifications ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`bg-white rounded-3xl shadow-md border border-gray-100 p-8 mb-4 ${!showPasswordForm ? 'flex justify-between items-center' : ''}`}
      >
        <h2
          className={`text-lg font-semibold text-gray-900  ${showPasswordForm && 'mb-6'}`}
        >
          Change Password
        </h2>

        {!showPasswordForm && (
          <div className="flex justify-end">
            <button
              onClick={() => setShowPasswordForm(true)}
              className="p-2 rounded-xl bg-primary text-white font-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition cursor-pointer"
            >
              Change Password
            </button>
          </div>
        )}

        {showPasswordForm && (
          <>
            <div className="space-y-4">
              <InputBox
                label="Current Password"
                type="password"
                withToggle
                value={passwordState.currentPassword}
                onChange={(e) =>
                  passwordDispatch({
                    type: 'set_current',
                    payload: e.target.value,
                  })
                }
                placeholder="Enter current password"
                styles="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary transition text-sm"
                labelstyles="text-sm font-medium text-gray-700"
              />

              <InputBox
                label="New Password"
                type="password"
                withToggle
                value={passwordState.newPassword}
                onChange={(e) =>
                  passwordDispatch({
                    type: 'set_new',
                    payload: e.target.value,
                  })
                }
                placeholder="Enter new password"
                styles="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary transition text-sm"
                labelstyles="text-sm font-medium text-gray-700"
              />

              <InputBox
                label="Confirm New Password"
                type="password"
                withToggle
                value={passwordState.confirmPassword}
                onChange={(e) =>
                  passwordDispatch({
                    type: 'set_confirm',
                    payload: e.target.value,
                  })
                }
                placeholder="Confirm new password"
                styles="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary transition text-sm"
                labelstyles="text-sm font-medium text-gray-700"
              />
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => {
                  passwordDispatch({ type: 'reset' });
                  setShowPasswordForm(false);
                }}
                disabled={passwordState.loading}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={passwordState.loading}
                className="p-2 rounded-xl bg-primary text-white font-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-50 cursor-pointer"
              >
                {passwordState.loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-md border border-red-100 p-8 mb-4">
        <div className="flex justify-between items-center p-4 rounded-xl bg-red-50">
          <div>
            <div className="font-medium text-red-700">Delete Account</div>
            <div className="text-sm text-red-500">
              Permanently remove your account and all data.
            </div>
          </div>

          <button className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
