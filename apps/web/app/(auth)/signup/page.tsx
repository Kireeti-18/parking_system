'use client';

import { useState } from 'react';

import AuthButton from '../AuthButton';
import { useRouter } from 'next/navigation';
import { InputBox } from '../../../components/components';

export default function Signup() {
  const router = useRouter();
  const [userSignupData, setUserSigninData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    access_token: '',
    user_type: 'user',
  });
  const inputBoxWidth =
    'w-[250px] sm:w-md border-gray-300/50 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:border-gray-0 focus:border-red-0 focus:border-green-0 focus:border-blue-0 focus:border-primary/50 px-3 py-3 placeholder:text-[14px] md:placeholder:text-[16px]';

  const updateUserData = (attr: string, value: string) => {
    setUserSigninData((prev) => ({
      ...prev,
      [attr]: value,
    }));
  };

  return (
    <div className="h-full">
      <div className="min-h-full flex justify-center items-center bg-gray-100">
        <div className="bg-white my-10 p-7 rounded-xl shadow-sm">
          <div className={`${inputBoxWidth} flex flex-col items-center py-5`}>
            <p className="text-2xl font-extrabold">Create Account</p>
            <p className="text-sm md:text-base text-gray-500 font-extralight">
              Join the parking management system
            </p>
          </div>
          <div className="w-full mb-3">
            <span className="text-sm md:text-base">Account Type</span>
            <div
              className={`${inputBoxWidth} flex bg-gray-100 p-1 mt-2 mb-1 rounded-lg`}
            >
              <div
                className={`w-[50%] py-2 text-center rounded-lg cursor-pointer text-gray-800 transition-all duration-300 ease-in-out ${
                  userSignupData.user_type === 'user'
                    ? 'bg-white-50'
                    : 'hover:text-black hover:font-semibold'
                }`}
                onClick={() => updateUserData('user_type', 'user')}
              >
                <span className="text-sm md:text-base">User</span>
              </div>

              <div
                className={`w-[50%] py-2 text-center rounded-lg cursor-pointer text-gray-800 transition-all duration-300 ease-in-out ${
                  userSignupData.user_type === 'admin_staff'
                    ? 'bg-white-50'
                    : 'hover:text-black hover:font-semibold'
                }`}
                onClick={() => updateUserData('user_type', 'admin_staff')}
              >
                <span className="text-sm md:text-base">Admin/Staff</span>
              </div>
            </div>
            <div className="text-center text-sm text-gray-500">
              <span className="text-sm md:text-base">
                {userSignupData.user_type === 'user'
                  ? 'Register to book parking slots'
                  : 'Manage parking areas and operations'}
              </span>
            </div>
          </div>
          <div>
            <div className="mb-3">
              <InputBox
                type="text"
                label="Full Name"
                id="signin_name"
                placeholder="Enter your full name"
                value={userSignupData.name || ''}
                onChange={(e) => updateUserData('name', e.target.value)}
                styles={inputBoxWidth}
                required
              />
            </div>
            <div className="mb-3">
              <InputBox
                type="text"
                label="Email"
                id="signin_email"
                placeholder="Enter your email"
                value={userSignupData.email || ''}
                onChange={(e) => updateUserData('email', e.target.value)}
                styles={inputBoxWidth}
                required
              />
            </div>
            {userSignupData.user_type === 'admin_staff' && (
              <div className="mb-2">
                <InputBox
                  type="text"
                  label="Access Token"
                  id="signin_access_token"
                  placeholder="Enter your access token"
                  value={userSignupData.access_token || ''}
                  onChange={(e) =>
                    updateUserData('access_token', e.target.value)
                  }
                  styles={`${inputBoxWidth} mb-1`}
                  required
                  withToggle
                />
                <p className="text-xs md:text-base text-gray-500">
                  Contact your administrator for the access token
                </p>
              </div>
            )}

            <div className="mb-3">
              <InputBox
                type="password"
                label="Password"
                id="signin_password"
                placeholder="Enter a password"
                value={userSignupData.password || ''}
                onChange={(e) => updateUserData('password', e.target.value)}
                styles={inputBoxWidth}
                required
                withToggle
              />
            </div>
            <div className="mb-3">
              <InputBox
                type="password"
                label="Confirm Password"
                id="signin_confirm_password"
                placeholder="Confirm your password"
                value={userSignupData.confirm_password || ''}
                onChange={(e) =>
                  updateUserData('confirm_password', e.target.value)
                }
                styles={inputBoxWidth}
                required
                withToggle
              />
            </div>
            <div>
              <AuthButton
                type="signup"
                text={'Create Account'}
                data={userSignupData}
              ></AuthButton>
            </div>
            <div className="flex flex-col items-center pt-2">
              <div>
                <span className="text-sm md:text-base text-gray-500">
                  {'Already have an account? '}
                </span>
                <span
                  className="text-sm md:text-base text_link"
                  onClick={() => router.push('/signin')}
                >
                  Sign in
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
