export type ThemeMode = 'light' | 'dark';
export type ThemePreference = ThemeMode | 'system';

export const themeFoundation = {
  typography: {
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSizeXs: '0.75rem',
    fontSizeSm: '0.875rem',
    fontSizeBase: '1rem',
    fontSizeLg: '1.125rem',
    fontSizeXl: '1.5rem',
    lineHeight: '1.5',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    xxl: '2rem',
  },
  radii: {
    sm: '0.375rem',
    control: '0.625rem',
    panel: '0.875rem',
    pill: '999px',
  },
  borders: {
    width: '1px',
  },
  shadows: {
    panel: '0 1px 2px rgb(15 23 42 / 0.05), 0 12px 28px rgb(15 23 42 / 0.06)',
    popover: '0 18px 48px rgb(15 23 42 / 0.18)',
  },
  controls: {
    height: '2.5rem',
    compactHeight: '2rem',
  },
  breakpoints: {
    mobile: '48rem',
    desktop: '80rem',
  },
} as const;

export const themeColors = {
  light: {
    canvas: '#f3f6f8',
    surface: '#ffffff',
    surfaceRaised: '#ffffff',
    surfaceMuted: '#edf2f4',
    text: '#172126',
    textMuted: '#59686f',
    border: '#cbd6da',
    borderStrong: '#9aabb2',
    brand: '#086f83',
    brandHover: '#075d6e',
    brandText: '#ffffff',
    focus: '#006fca',
    hover: '#e5eef1',
    selected: '#d8edf2',
    danger: '#a92323',
    dangerSurface: '#ffebeb',
    success: '#137044',
    successSurface: '#e4f5eb',
    warning: '#7a5100',
    warningSurface: '#fff2cc',
    neutral: '#46575f',
    neutralSurface: '#e8edef',
    overlay: 'rgb(15 23 42 / 0.48)',
  },
  dark: {
    canvas: '#101719',
    surface: '#172125',
    surfaceRaised: '#1d292e',
    surfaceMuted: '#243238',
    text: '#edf4f6',
    textMuted: '#b5c2c7',
    border: '#3e5057',
    borderStrong: '#667b83',
    brand: '#4ec0d4',
    brandHover: '#75d0df',
    brandText: '#071719',
    focus: '#76c7ff',
    hover: '#26363c',
    selected: '#21424b',
    danger: '#ff9b9b',
    dangerSurface: '#4a2427',
    success: '#78d5a7',
    successSurface: '#19392b',
    warning: '#f6ce70',
    warningSurface: '#42361b',
    neutral: '#c2d0d5',
    neutralSurface: '#2b383d',
    overlay: 'rgb(0 0 0 / 0.7)',
  },
} as const;

const tokenNames: Record<keyof (typeof themeColors)['light'], string> = {
  canvas: '--color-canvas',
  surface: '--color-surface',
  surfaceRaised: '--color-surface-raised',
  surfaceMuted: '--color-surface-muted',
  text: '--color-text',
  textMuted: '--color-text-muted',
  border: '--color-border',
  borderStrong: '--color-border-strong',
  brand: '--color-brand',
  brandHover: '--color-brand-hover',
  brandText: '--color-brand-text',
  focus: '--color-focus',
  hover: '--color-hover',
  selected: '--color-selected',
  danger: '--color-danger',
  dangerSurface: '--color-danger-surface',
  success: '--color-success',
  successSurface: '--color-success-surface',
  warning: '--color-warning',
  warningSurface: '--color-warning-surface',
  neutral: '--color-neutral',
  neutralSurface: '--color-neutral-surface',
  overlay: '--color-overlay',
};

const foundationTokens: Record<string, string> = {
  '--font-family': themeFoundation.typography.fontFamily,
  '--font-size-xs': themeFoundation.typography.fontSizeXs,
  '--font-size-sm': themeFoundation.typography.fontSizeSm,
  '--font-size-base': themeFoundation.typography.fontSizeBase,
  '--font-size-lg': themeFoundation.typography.fontSizeLg,
  '--font-size-xl': themeFoundation.typography.fontSizeXl,
  '--line-height': themeFoundation.typography.lineHeight,
  '--space-xs': themeFoundation.spacing.xs,
  '--space-sm': themeFoundation.spacing.sm,
  '--space-md': themeFoundation.spacing.md,
  '--space-lg': themeFoundation.spacing.lg,
  '--space-xl': themeFoundation.spacing.xl,
  '--space-xxl': themeFoundation.spacing.xxl,
  '--radius-sm': themeFoundation.radii.sm,
  '--radius-control': themeFoundation.radii.control,
  '--radius-panel': themeFoundation.radii.panel,
  '--radius-pill': themeFoundation.radii.pill,
  '--border-width': themeFoundation.borders.width,
  '--shadow-panel': themeFoundation.shadows.panel,
  '--shadow-popover': themeFoundation.shadows.popover,
  '--control-height': themeFoundation.controls.height,
  '--control-height-compact': themeFoundation.controls.compactHeight,
};

export const THEME_STORAGE_KEY = 'freight-theme';

export function resolveTheme(preference: ThemePreference, prefersDark: boolean): ThemeMode {
  return preference === 'system' ? (prefersDark ? 'dark' : 'light') : preference;
}

export function getAgGridThemeClass(mode: ThemeMode) {
  return mode === 'dark' ? 'ag-theme-quartz-dark' : 'ag-theme-quartz';
}

export function applyTheme(mode: ThemeMode, root = document.documentElement) {
  root.dataset.theme = mode;
  root.style.colorScheme = mode;

  Object.entries(foundationTokens).forEach(([name, value]) => root.style.setProperty(name, value));
  Object.entries(themeColors[mode]).forEach(([name, value]) => {
    root.style.setProperty(tokenNames[name as keyof (typeof themeColors)['light']], value);
  });
}
