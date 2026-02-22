'use client';

import React, { useEffect, useRef } from 'react';

export type PopupProps = {
  isOpen: boolean;
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  closable?: boolean;
  onClose?: () => void;
  ariaLabel?: string;
  title?: string;
  description?: string;
  rounded?: string;
};

const toSize = (v?: number | string, fallback?: string) => {
  if (v === undefined) return fallback;
  return typeof v === 'number' ? `${v}px` : v;
};

export function Popup({
  isOpen,
  children,
  width,
  height,
  closable = true,
  title = '',
  onClose,
  description = '',
  rounded = 'rounded-2xl',
}: PopupProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !closable) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, closable, onClose]);

  const onBackdropClick = (e: React.MouseEvent) => {
    if (!closable) return;
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  if (!isOpen) return null;

  const style: React.CSSProperties = {
    width: toSize(width, 'min(92vw, 640px)'),
    maxHeight: toSize(height, 'auto'),
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-center justify-center"
      onClick={onBackdropClick}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div
        ref={dialogRef}
        className={`relative z-10 w-full overflow-hidden ${rounded} bg-white shadow-2xl `}
        style={style}
      >
        {title.length > 0 && (
          <div className="text-xl text-gray-700 font-semibold pt-3 pl-4 h-[42px]">
            {title}
          </div>
        )}
        {description.length > 0 && (
          <div className="text-sm text-gray-500 pl-4 h-[30px]">
            {description}
          </div>
        )}
        {closable && (
          <button
            type="button"
            onClick={() => onClose?.()}
            aria-label="Close"
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-zinc-700 backdrop-blur hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-zinc-200 cursor-pointer"
          >
            <span className="text-xl leading-none text-black">X</span>
          </button>
        )}

        <div className="max-h-[92vh] overflow-auto">{children}</div>
      </div>
    </div>
  );
}
