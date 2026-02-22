import { useMemo } from 'react';
import Image from 'next/image';

export function Avathar({
  avathar = 'boy-1',
  size = '8',
}: {
  avathar?: string;
  size?: string;
}) {
  const src = useMemo(() => `/avathars/${avathar}.png`, [avathar]);

  const pxSize = parseInt(size, 10) * 4;

  return (
    <Image
      className="me-2 rounded-full"
      src={src}
      alt="a"
      width={pxSize}
      height={pxSize}
    />
  );
}

export const Avatar = Avathar;
