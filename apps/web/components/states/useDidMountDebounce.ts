'use client';

import { useRef } from 'react';
import { useDebounce } from 'react-use';

type DebouncedFunction = () => void;

export function useDidMountDebounce(
  func: DebouncedFunction,
  timeout: number,
  deps: React.DependencyList,
): void {
  const didMount = useRef<boolean>(false);

  useDebounce(
    () => {
      if (didMount.current) {
        func();
      } else {
        didMount.current = true;
      }
    },
    timeout,
    deps,
  );
}
