'use client';

import { useAtom } from 'jotai';
import { AlertItem } from '@parking/validations';
import { alertsAtom } from '../../../packages/services/atoms';

interface Props extends AlertItem {
  onClose: (id: string) => void;
}

export function AlertContainer() {
  const [alerts, setAlerts] = useAtom(alertsAtom);

  const typeStyles = {
    success: 'bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400',
    failed: 'bg-red-50 text-red-800 dark:bg-gray-800 dark:text-red-400',
    warning:
      'bg-yellow-50 text-yellow-800 dark:bg-gray-800 dark:text-yellow-400',
    info: 'bg-blue-50 text-blue-800 dark:bg-gray-800 dark:text-blue-400',
  };

  function Alert({ id, message, type, onClose }: Props) {
    return (
      <div
        className={`w-64 xl:w-100 break-words p-4 mb-2 rounded-lg shadow flex whitespace-pre-wrap items-center ${typeStyles[type]}`}
        role="alert"
      >
        <svg
          className="shrink-0 w-4 h-4 me-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="text-sm font-medium flex-1">{message}</span>
        <button
          onClick={() => onClose(id)}
          className="ml-2 text-inherit hover:opacity-70"
        >
          ✕
        </button>
      </div>
    );
  }

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2 z-51">
      {alerts.map((alert) => (
        <Alert key={alert.id} {...alert} onClose={removeAlert} />
      ))}
    </div>
  );
}
