/**
 * context.tsx
 * The palette plumbing. Mirrors the Swift package's `@Environment(\.palette)`:
 * an app resolves a palette once at the root and every component below reads it
 * rather than hardcoding a colour.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { darkPalette, makePalette, type Palette, type Theme } from './theme';

/**
 * How an app draws a symbol.
 *
 * The Swift components name SF Symbols directly. React Native has no built-in
 * symbol set and this package refuses to force one on you, so `Mascot` and
 * `PageBackdrop` ask the app instead. Wire it once to whatever you already use
 * (`expo-symbols` for real SF Symbols on iOS, `@expo/vector-icons` elsewhere).
 *
 * `Chevron` and `CheckBox` do not go through this: they are drawn from plain
 * views so the core of the language works with no icon set at all.
 */
export type IconRenderer = (props: {
  name:  string;
  size:  number;
  color: string;
}) => React.ReactNode;

interface TuganeContextValue {
  palette: Palette;
  theme:   Theme;
  icon?:   IconRenderer;
}

const TuganeContext = createContext<TuganeContextValue>({
  palette: darkPalette,
  theme:   'dark',
});

export interface TuganeDesignProviderProps {
  /** Which palette to resolve. The app owns this, not the OS. */
  theme: Theme;
  /** Optional accent override; every other token stays canonical. */
  accent?: string;
  /** How to draw a named symbol. Required only if you use Mascot/PageBackdrop. */
  icon?: IconRenderer;
  children: React.ReactNode;
}

export function TuganeDesignProvider({
  theme,
  accent,
  icon,
  children,
}: TuganeDesignProviderProps) {
  const value = useMemo<TuganeContextValue>(
    () => ({ palette: makePalette(theme, accent), theme, icon }),
    [theme, accent, icon],
  );
  return <TuganeContext.Provider value={value}>{children}</TuganeContext.Provider>;
}

/** The resolved palette. The hook every component reaches for. */
export const usePalette = (): Palette => useContext(TuganeContext).palette;

/** Palette plus the theme name and icon renderer, for the rarer cases. */
export const useTugane = (): TuganeContextValue => useContext(TuganeContext);
