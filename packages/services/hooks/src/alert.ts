import { AlertType } from '@parking/validations';
import { useSetAtom } from 'jotai';
import { showAlertAtom } from '../../atoms';

export function useShowAlert() {
  const show = useSetAtom(showAlertAtom);
  return (message: string, type: AlertType = 'info') => {
    show({ message, type });
  };
}
