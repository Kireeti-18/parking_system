'use client';

import { useState } from 'react';
import AuthButton from '../AuthButton';
import { useRouter } from 'next/navigation';
import { InputBox } from '../../../components/components';

export default function SigninPage() {
  const router = useRouter();
  const inputBoxWidth =
    'w-[250px] sm:w-md border-gray-300/50 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:border-gray-0 focus:border-red-0 focus:border-green-0 focus:border-blue-0 focus:border-primary/50 px-3 py-3 placeholder:text-[14px] md:placeholder:text-[16px]';

  const [userSigninData, setUserSigninData] = useState({
    email: '',
    password: '',
  });

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
          <div className="flex flex-col items-center py-5">
            <p className="text-2xl font-extrabold">Welcome Back</p>
            <p className="text-sm md:text-base text-gray-500 font-extralight">
              Sign in to your parking account
            </p>
          </div>
          <div>
            <div className="mt-2 mb-3">
              <InputBox
                type="text"
                label="Email"
                id="signin_email"
                placeholder="Enter Email"
                value={userSigninData.email || ''}
                onChange={(e) => updateUserData('email', e.target.value)}
                styles={inputBoxWidth}
                required
              />
            </div>
            <div className="mt-2 mb-3">
              <InputBox
                type="password"
                label="Password"
                id="signin_password"
                placeholder="Enter your password"
                value={userSigninData.password || ''}
                onChange={(e) => updateUserData('password', e.target.value)}
                styles={inputBoxWidth}
                required
                withToggle
              />
            </div>
            <div>
              <AuthButton type="signin" data={userSigninData} text="Sign in" />
            </div>

            <div className="flex flex-col items-center pt-2">
              <div>
                <span className="text-sm md:text-base text-gray-500">
                  {"Don't have an account? "}
                </span>
                <span
                  className="text-sm md:text-base text_link"
                  onClick={() => router.push('/signup')}
                >
                  Sign up
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
