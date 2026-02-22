'use client';

import React, { useEffect } from 'react';
import { useShowAlert } from '@parking/services';
import {
  AuthType,
  formatErrors,
  signinSchema,
  signupSchema,
  signupWithPassSchema,
} from '@parking/validations';
import { loaderAtom } from '@parking/services';
import { useSetAtom } from 'jotai';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { signupAction } from '../../lib/actions/signup';
import { Button } from '../../components/components';

export default function AuthButton({
  text,
  type,
  data,
}: {
  text: string;
  type: 'signin' | 'signup' | string;
  data: AuthType;
}) {
  const router = useRouter();
  const showAlert = useShowAlert();
  const setLoader = useSetAtom(loaderAtom);
  const sessionData = useSession();
  const isAuthenticated = sessionData.status === 'authenticated';
  const userData = isAuthenticated ? sessionData.data.user : null;

  const redirectToDashboard = () => {
    const userType = userData?.user_type;
    if (userType === 'admin') router.push('/admin');
    else router.push('/');
  };

  useEffect(() => {
    if (isAuthenticated) {
      setLoader(true);
      redirectToDashboard();
    }
  }, [isAuthenticated]);
  

  const handleSignin = async () => {
    try {
      setLoader(true);
      const res = await signIn('credentials', {
        redirect: false,
        email: data.email.toLowerCase(),
        password: data.password,
      });

      const resp: any = res;
      if (resp?.error) {
        showAlert(resp.error || 'Invalid credentials', 'failed');
        return;
      }

      showAlert('Successfully logged in', 'success');
      setLoader(false);
    } catch (err: any) {
      setLoader(false);
      showAlert('Something went wrong while signing in', 'failed');
    }
  };

  const handleSignupThenSignin = async () => {
    try {
      setLoader(true);
      await signupAction({
        name: data.name || '',
        email: data.email.toLowerCase(),
        password: data.password,
        user_type: data.user_type || 'user',
        access_token: data.access_token,
      });

      showAlert('Signup successful', 'success');

      const res = await signIn('credentials', {
        redirect: false,
        email: data.email.toLowerCase(),
        password: data.password,
      });

      const resp: any = res;
      if (resp?.error) {
        showAlert(
          'Signup succeeded but signin failed: ' + resp.error,
          'failed',
        );
        return;
      }

      showAlert('Successfully logged in', 'success');
      setLoader(false);
    } catch (err: any) {
      setLoader(false);
      if (err?.response?.data?.message) {
        showAlert(err.response.data.message, 'failed');
      } else {
        showAlert('Signup failed', 'failed');
      }
    }
  };

  const validateSignupData = async () => {
    try {
      let valid = false as boolean;
      let message: any;
      let passNotSameFlag = false;
      let errors = [] as string[];

      if (data.password === data.confirm_password) {
        const result = signupWithPassSchema.safeParse({
          name: data.name,
          email: data.email,
          password: data.password,
          user_type: data.user_type,
          access_token: data.access_token,
        });
        if (result.success) valid = true;
        else {
          valid = false;
          message = result.error;
        }
      } else {
        valid = false;
        passNotSameFlag = true;
        const result = signupSchema.safeParse({
          name: data.name,
          email: data.email,
          user_type: data.user_type,
          access_token: data.access_token,
        });
        if (!result.success) message = result.error;
      }

      if (!valid) {
        if (message) errors = formatErrors(message);
        if (passNotSameFlag)
          errors = [...errors, 'Password is not same as confirm password'];
        errors.forEach((e) => showAlert(e, 'failed'));
      } else {
        await handleSignupThenSignin();
      }
      setLoader(false);
    } catch (e) {
      setLoader(false);
    }
  };

  const validateSigninData = async () => {
    try {
      let valid = false as boolean;
      let message: any;
      const result = signinSchema.safeParse({
        email: data.email,
        password: data.password,
      });
      if (result.success) valid = true;
      else {
        valid = false;
        message = result.error;
      }

      if (!valid) {
        const errors = formatErrors(message);
        errors.forEach((e) => showAlert(e, 'failed'));
      } else {
        await handleSignin();
      }
      setLoader(false);
    } catch (e) {
      setLoader(false);
    }
  };

  const authenticateUser = () => {
    try {
      if (type === 'signup') validateSignupData();
      else validateSigninData();
    } catch (e) {
      setLoader(false);
    }
  };

  return (
    <Button
      onSubmit={() => authenticateUser()}
      styles={`text-sm md:text-md text-gray-50 rounded-lg text-base my-2 font-bold cursor-pointer bg-primary`}
      btnColor="primary"
    >
      {text}
    </Button>
  );
}
