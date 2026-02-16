import { useState, useEffect, useCallback, useRef } from 'react';
import { AsyncState } from '@types/index';

type AsyncFunction<T, Args extends any[]> = (...args: Args) => Promise<T>;

interface UseAsyncOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

export const useAsync = <T, Args extends any[] = []>(
  asyncFunction: AsyncFunction<T, Args>,
  options: UseAsyncOptions = {}
) => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: options.immediate !== false,
    error: null,
  });

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: Args) => {
      setState({ data: null, loading: true, error: null });
      try {
        const response = await asyncFunction(...args);
        if (isMountedRef.current) {
          setState({ data: response, loading: false, error: null });
          options.onSuccess?.(response);
        }
        return response;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        if (isMountedRef.current) {
          setState({ data: null, loading: false, error: err });
          options.onError?.(err);
        }
        throw err;
      }
    },
    [asyncFunction, options]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};
