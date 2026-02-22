import { atom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';
import type { AlertItem, AlertType } from '@parking/validations';

export const alertsAtom = atom<AlertItem[]>([]);

export const showAlertAtom = atom(
  null,
  (get, set, update: { message: string; type: AlertType }) => {
    const newAlert: AlertItem = {
      id: uuidv4(),
      message: update.message,
      type: update.type,
    };
    set(alertsAtom, [...get(alertsAtom), newAlert]);

    setTimeout(() => {
      set(alertsAtom, (prev) => prev.filter((a) => a.id !== newAlert.id));
    }, 3000);
  },
);
