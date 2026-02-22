'use client ';
import { useSession } from 'next-auth/react';

export const useUserInfo = () => {
  const session = useSession();
  const type =
    session.status === 'authenticated'
      ? session?.data?.user?.user_type
      : undefined;
  return {
    userType: type,
    email: session?.data?.user?.email,
    isAdmin: type === 'admin',
  };
};
