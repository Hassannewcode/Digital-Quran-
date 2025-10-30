
// Fix: Import Dispatch and SetStateAction to resolve 'Cannot find namespace 'React'' error.
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function getValue<T>(key: string, initialValue: T | (() => T)): T {
    const savedValue = localStorage.getItem(key);
    if (savedValue !== null) {
        try {
            return JSON.parse(savedValue);
        } catch (error) {
            console.error(`Error parsing localStorage key “${key}”:`, error);
            return initialValue instanceof Function ? initialValue() : initialValue;
        }
    }
    
    return initialValue instanceof Function ? initialValue() : initialValue;
}

// Fix: Use imported Dispatch and SetStateAction types directly.
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => getValue(key, initialValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
