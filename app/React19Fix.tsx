"use client";

import { useEffect } from 'react';

export default function React19Fix() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const originalConsoleError = console.error;
      console.error = (...args: unknown[]) => {
        if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
          return;
        }
        originalConsoleError.apply(console, args);
      };
    }
  }, []);

  return null;
}
