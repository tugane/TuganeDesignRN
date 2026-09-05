/**
 * TuganeDesign for React Native.
 * The same design language as the Swift package, for the apps that aren't Swift.
 */

// Theme & palette
export {
  type Theme,
  type Palette,
  darkPalette,
  lightPalette,
  paletteFor,
  makePalette,
  toggled,
  toggleLabel,
  withAlpha,
  lighten,
  darken,
} from './theme';

// Plumbing
export {
  TuganeDesignProvider,
  type TuganeDesignProviderProps,
  type IconRenderer,
  usePalette,
  useTugane,
} from './context';

// Tokens
// No spacing scale: the Swift package has none either, setting padding per view.
export { radius, type, weight, control, hitSlopFor } from './tokens';

// Components
export { PillButton, type PillRole, type PillButtonProps } from './components/PillButton';
export { LinkButton, type LinkButtonProps } from './components/LinkButton';
export { Card, type CardProps } from './components/Card';
export { CheckBox, type CheckBoxProps } from './components/CheckBox';
export { Chevron, type ChevronProps } from './components/Chevron';
export { FieldLabel, SectionLabel, type LabelProps } from './components/Labels';
export { Mascot, type MascotProps } from './components/Mascot';
export { NoiseOverlay, type NoiseOverlayProps } from './components/NoiseOverlay';
export { PageBackdrop, type PageBackdropProps } from './components/PageBackdrop';

// Copy helpers
export { plural } from './plural';
