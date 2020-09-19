import { useCallback, useLayoutEffect, useState, useRef } from 'react';

interface ILoadingValue<T> {
  loading: boolean;
  error?: any;
  value?: T;
}
export const useLoadingValue = <T>(initialValue?: T, initialLoading = true) => {
  const toInitialState = () => ({
    loading: initialLoading,
    error: undefined,
    value: initialValue
  });
  const [{ loading, error, value }, setState] = useState<ILoadingValue<T>>(
    toInitialState()
  );

  const setLoading = (nextLoading: boolean) =>
    setState({ loading: nextLoading, value, error });
  const setValue = (nextValue: T) =>
    setState({ loading: false, value: nextValue, error: undefined });
  const setError = (nextError: any) =>
    setState({ loading: false, value: undefined, error: nextError });
  const reset = () => setState(toInitialState());

  return { loading, error, value, setLoading, setValue, setError, reset };
};

export const usePromise = <T>(
  fn: () => Promise<T>,
  listeners?: any[]
): [void | T, boolean, any, () => void] => {
  // rev updates everytime a new value is requested.
  // allows as to make sure, that only the latest call is used
  // to update the value, avoiding potential race conditions, where
  // call A might return after call B and hence override the already
  // set value coming from B
  const [rev, setRev] = useState(0);
  const ref = useRef(0);
  const {
    value,
    error,
    loading,
    setLoading,
    setValue,
    setError
  } = useLoadingValue<T>();

  const forceReload = useCallback(() => setRev((prev) => prev + 1), []);

  // useLayout effect, because if we want to go to another loading
  // state, the old value should not be flushed to them DOM!
  useLayoutEffect(() => {
    if (!loading) {
      setLoading(true);
    }
    const v = ++ref.current;
    fn().then(
      (val) => {
        if (v === ref.current) {
          setValue(val);
        }
      },
      (err) => {
        if (v === ref.current) {
          setError(err);
        }
      }
    );
    // eslint-disable-next-line
  }, [...listeners, rev]);

  return [value, loading, error, forceReload];
};
