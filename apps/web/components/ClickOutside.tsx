'use client';

import { useEffect, useRef } from 'react';

type ClickOutsideProps = {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

const ClickOutside = ({
  onClose,
  children,
  className = '',
}: ClickOutsideProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ClickOutside;
