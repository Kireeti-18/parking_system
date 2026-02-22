import { get_location } from '@parking/services';
import { LatLng } from '@parking/validations';
import { createContext, useState, ReactNode } from 'react';

type LocationContextType = {
  location: LatLng;
  updateLocation: (
    fetch: boolean,
    lat?: number | null,
    lng?: number | null,
  ) => void;
};

export const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

type LocationProviderProps = {
  children: ReactNode;
};

export function LocationProvider({ children }: LocationProviderProps) {
  const [location, setLocation] = useState<LatLng>({
    lat: null,
    lng: null,
  });

  const updateLocation = async (
    fetch: boolean = false,
    lat: number | null = null,
    lng: number | null = null,
  ) => {
    let latitude = lat;
    let longitude = lng;

    if (fetch) {
      const location = await get_location();
      latitude = location.lat;
      longitude = location.lng;
    }

    setLocation({ lat: latitude, lng: longitude });
  };

  return (
    <LocationContext.Provider value={{ location, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
}
