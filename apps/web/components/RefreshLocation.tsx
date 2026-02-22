'use client';

import { useState, useRef } from 'react';
import { Icon } from './Icons';
import { useLocation } from './states/useLocation';

export function RefreshLocation() {
  const { updateLocation } = useLocation();

  const [showPopup, setShowPopup] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = () => {
    timerRef.current = setTimeout(() => {
      setShowPopup(true);

      if (navigator.vibrate) navigator.vibrate(20);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowPopup(false);
  };

  return (
    <div className="relative inline-flex">
      <div
        onClick={() => updateLocation(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="
          flex items-center gap-2
          border border-gray-400 px-1 py-1 rounded-xl
          bg-primary/50 cursor-pointer text-gray-700
          select-none
        "
      >
        <Icon name="refresh" />

        <span className="hidden md:inline text-sm">Refresh Location</span>
      </div>

      {showPopup && (
        <div
          className="
            absolute top-full mt-2 left-1/2 -translate-x-1/2
            px-3 py-1 rounded-md
            bg-black text-white text-xs
            whitespace-nowrap shadow-lg
            md:hidden
            z-50
          "
        >
          Refresh Location
          <div
            className="
              absolute -top-1 left-1/2 -translate-x-1/2
              w-2 h-2 bg-black rotate-45
            "
          />
        </div>
      )}
    </div>
  );
}
