'use client';

import { useRouter } from 'next/navigation';

export function Logo() {
  const router = useRouter();
  return (
    <div
      className="flex items-center h-16 cursor-pointer"
      onClick={() => router.push('/')}
    >
      <img src="/logo.png" className="w-15" />
      <img src="/title.png" className="w-18 hidden lg:block" />
    </div>
  );
}
