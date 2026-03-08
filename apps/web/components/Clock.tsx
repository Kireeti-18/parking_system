'use client';

import { useEffect, useState } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  const dayDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col items-center leading-tight">
      <div className="font-mono text-2xl font-semibold">
        <span className="text-blue-600">
          {hours}:{minutes}
        </span>
        <span className="text-secondaryL">:{seconds}</span>
      </div>

      <div className="text-xs text-gray-500">{dayDate}</div>
    </div>
  );
}
