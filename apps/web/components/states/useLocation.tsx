import { useContext, useEffect } from 'react';
import { LocationContext } from '../contexts/locationProvider';

export const useLocation = () => {
  const context = useContext(LocationContext);

  useEffect(() => {
    context?.updateLocation(true);
  }, []);

  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }

  return context;
};

