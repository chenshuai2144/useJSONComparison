import { useRef, useEffect } from 'react';

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: string, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

const jsonCompareEquals = (value: any, nextValue: any) => {
  try {
    return (
      JSON.stringify(value, getCircularReplacer()) ===
      JSON.stringify(nextValue, getCircularReplacer())
    );
  } catch (error) {
    // do something
  }
  return false;
};

function useDeepCompareMemoize(value: any) {
  const ref = useRef();
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier
  if (!jsonCompareEquals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export default function useDeepCompareEffect(effect: React.EffectCallback, dependencies?: Object) {
  useEffect(effect, useDeepCompareMemoize(dependencies));
}
