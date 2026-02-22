'use client';

import { LatLng } from '@parking/validations';
import { Popup } from './Popup';
import { useState } from 'react';
import { MapComponent } from './MapComponent';
import { Icon } from './Icons';

export function ParkingLocation({ coordinates }: { coordinates: LatLng }) {
  const [isOpen, setIsOpen] = useState(false);
  if (coordinates.lat === null || coordinates.lng === null) {
    return <div>Wrong Coordinates</div>;
  }

  const coordinatesInfo = {
    lat: coordinates.lat,
    lng: coordinates.lng,
  };
  return (
    <>
      <div
        className="flex items-center gap-2 px-3 py-1.5 bg-card/50 backdrop-blur rounded-2xl bg-white cursor-pointer shadow-md"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <Icon name="map-marker" />
          <span className="flex items-center gap-2 text-[10px] font-mono">
            {coordinates.lat}°, {coordinates.lng}°
          </span>
        </div>
      </div>
      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        width={560}
        height={540}
        closable
        title="My Parking Location"
        description={`${coordinates.lat}°, ${coordinates.lng}°`}
      >
        <MapComponent coordinates={coordinatesInfo} height="468px" />
      </Popup>
    </>
  );
}
