import React from 'react';
import { ClientRouter } from './ClientRoute';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  isZoom?: boolean;
  route?: string;
  rounded?: boolean;
  roundedStyles?: string;
  pointer?: boolean;
  shadow?: boolean;
};

export function Card({
  children,
  className = '',
  isZoom = false,
  route = '',
  rounded = true,
  roundedStyles = 'rounded-xl',
  pointer = false,
  shadow = true,
}: CardProps) {
  const cardContent = (
    <div
      className={[
        'relative bg-white',
        shadow ? 'shadow-sm' : '',
        rounded ? roundedStyles : '',
        isZoom ? 'transition-transform duration-200 hover:scale-[1.02]' : '',
        pointer || route ? 'cursor-pointer' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );

  return route ? (
    <ClientRouter route={route}>{cardContent}</ClientRouter>
  ) : (
    cardContent
  );
}
