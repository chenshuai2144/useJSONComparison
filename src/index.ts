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

/**
 * 一个更加安全的 stringify，可以解决循环依赖的问题
 * @param value
 */
const stringify = (value: any) => JSON.stringify(value, getCircularReplacer());

const jsonCompareEquals = (value: any, nextValue: any) => {
  try {
    return stringify(value) === stringify(nextValue);
  } catch (error) {
    // do something
  }
  return false;
};

function useJsonCompareMemoize(value: any) {
  const ref = useRef();
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier
  if (!jsonCompareEquals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export { stringify };

export default function useDeepJSONEffect(effect: React.EffectCallback, dependencies?: Object) {
  useEffect(effect, useJsonCompareMemoize(dependencies));
}
