/**
 * File: theme-provider.tsx
 * Purpose: Theme provider wrapper component for next-themes integration.
 *          Enables dark/light mode switching and theme persistence.
 * Author: Hamza Ahmad
 */
'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
