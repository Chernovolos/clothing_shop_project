import { useCallback, useEffect, useRef } from "react";

type AsyncFunction = (...args: any[]) => Promise<any>;

interface PendingRequest {
  timeout: ReturnType<typeof setTimeout> | null;
  reject: ((reason?: unknown) => void) | null;
}

export function useDebounce<T extends AsyncFunction>(
  callback: T,
  delay = 500,
) {

  const pendingRequestRef = useRef<PendingRequest>({
    timeout: null,
    reject: null,
  })

  useEffect(() => {
    return () => {
      const pendingRequest = pendingRequestRef.current;

      if (pendingRequest.timeout) {
        clearTimeout(pendingRequest.timeout);
      }

      pendingRequest.reject?.(new Error('Cancelled'));

      pendingRequest.timeout = null;
      pendingRequest.reject = null;
    };
  }, []);

  return useCallback((...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    const pendingRequest = pendingRequestRef.current;

    if (pendingRequest.timeout) {
      clearTimeout(pendingRequest.timeout);
    }

    pendingRequest.reject?.(new Error('Cancelled'));

    pendingRequest.timeout = null;
    pendingRequest.reject = null;

    return new Promise((resolve, reject) => {
      pendingRequest.reject = reject;

      pendingRequest.timeout = setTimeout( async () => {
        try {
          const result = await callback(...args);
          pendingRequest.timeout = null;
          pendingRequest.reject = null;

          resolve(result);
        } catch (error) {
          pendingRequest.timeout = null;
          pendingRequest.reject = null;

          reject(error);
        }
      }, delay);

    })
  }, [callback, delay]);
}