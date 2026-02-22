import { atom } from 'jotai';

export const currentLocationAtom = atom<{ lat: any; lng: any }>({
  lat: null,
  lng: null,
});
