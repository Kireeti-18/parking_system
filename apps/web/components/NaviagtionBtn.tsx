'use client';

import { LatLngLiteral } from '@parking/validations';

type Props = {
  coordinates: LatLngLiteral;
  styles?: string;
};

const NavigationBtn = ({ coordinates, styles = '' }: Props) => {
  const handleNavigate = () => {
    const { lat, lng } = coordinates;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleNavigate}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-primary/80 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary active:scale-95 transition cursor-pointer ${styles}`}
    >
      Navigate
    </button>
  );
};

export default NavigationBtn;
