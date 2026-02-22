'use client';

import { loaderAtom } from '@parking/services';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';

export function ClientRouter({
  children,
  route = '',
}: {
  children: React.ReactNode;
  route: string;
}) {
  const router = useRouter();
  const setLoader = useSetAtom(loaderAtom);

  return (
    <div
      onClick={() => {
        setLoader(true);
        router.push(`${route}`);
      }}
    >
      {children}
    </div>
  );
}
