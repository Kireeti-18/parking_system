'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import Providers from '../components/contexts/Providers';
import { getPathType } from '../components/services';
import RedirectBasedonUserType from '../components/client/RedirectBasedonUserType';
import './globals.css';

import { loaderAtom } from '@parking/services';
import { Header } from '../components/components';
import { useSession } from 'next-auth/react';

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const setLoader = useSetAtom(loaderAtom);
  const sessionData = useSession();
  const status = sessionData.status;
  const isAuthenticated = status === 'authenticated';
  const userType = isAuthenticated ? sessionData.data.user.user_type : null;

  useEffect(() => {
    setLoader(false);
  }, [pathname]);

  return (
    <div className="h-[100vh]">
      <Header type={getPathType(pathname, userType)} />
      <div className="h-[calc(100vh-64px)] overflow-y-auto bg-gray-100">
        {children}
      </div>
    </div>
  );
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>PARKit</title>
        <link rel="icon" type="image/x-icon" href="/logo.png" />
      </head>
      <body>
        <Providers>
          <RedirectBasedonUserType />
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
