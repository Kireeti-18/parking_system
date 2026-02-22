import { useEffect, useRef, useCallback } from 'react';

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<(() => void) | null>(null);
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const clearTimer = useCallback(() => {
    if (intervalId.current !== null) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (delay === null) return;

    clearTimer();

    intervalId.current = setInterval(() => {
      savedCallback.current?.();
    }, delay);
  }, [delay, clearTimer]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  const resetTimer = useCallback(() => {
    startTimer();
  }, [startTimer]);

  return resetTimer;
}
