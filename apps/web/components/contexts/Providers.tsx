'use client';

import { loaderAtom } from '@parking/services';
import { AlertContainer, CustomLoader } from '../components';
import { useAtomValue } from 'jotai';
import { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';
import { MapProvider } from './MapProvider';
import { LocationProvider } from './locationProvider';

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loading = useAtomValue(loaderAtom);

  return (
    <>
      <SessionProvider>
        <LocationProvider>
          {loading && <CustomLoader />}
          <AlertContainer />
          <MapProvider>
            <Suspense fallback={<CustomLoader />}>{children}</Suspense>
          </MapProvider>
        </LocationProvider>
      </SessionProvider>
    </>
  );
}
