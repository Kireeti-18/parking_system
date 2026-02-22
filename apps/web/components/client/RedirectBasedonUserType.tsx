'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getPathType } from '../services';
import { useSetAtom } from 'jotai';
import { loaderAtom } from '@parking/services';

export default function RedirectBasedonUserType() {
  const router = useRouter();
  const sessionData = useSession();
  const status = sessionData.status;
  const isAuthenticated = status === 'authenticated';
  const isUnAuthenticated = status === 'unauthenticated';
  const userData = isAuthenticated ? sessionData.data.user : null;
  const pathname = usePathname();
  const pathType = getPathType(pathname, null)[0];
  const setLoader = useSetAtom(loaderAtom);

  const redirectToDashboard = () => {
    const userType = userData?.user_type;
    if (pathType === 'auth') {
      setLoader(true);
      if (userType === 'admin') router.push('/admin');
      else router.push('/');
    }
  };

  const redirectToSignin = () => {
    router.push('/signin');
  };

  useEffect(() => {
    if (isAuthenticated) {
      redirectToDashboard();
    } else if (isUnAuthenticated) {
      if (pathType === 'default') {
        redirectToSignin();
      }
    }
  }, [sessionData.status]);

  if (!isAuthenticated) return <></>;
}
