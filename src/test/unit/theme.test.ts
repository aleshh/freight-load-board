import { beforeEach, describe, expect, it } from 'vitest';
import { applyTheme, getAgGridThemeClass, resolveTheme, themeColors } from '../../theme/theme';

describe('theme', () => {
  beforeEach(() => document.documentElement.removeAttribute('style'));

  it('resolves the system preference', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
    expect(resolveTheme('light', true)).toBe('light');
  });

  it('selects the matching AG Grid legacy theme', () => {
    expect(getAgGridThemeClass('light')).toBe('ag-theme-quartz');
    expect(getAgGridThemeClass('dark')).toBe('ag-theme-quartz-dark');
  });

  it('applies shared application and grid color tokens', () => {
    applyTheme('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.style.getPropertyValue('--color-canvas')).toBe(themeColors.dark.canvas);
    expect(document.documentElement.style.getPropertyValue('--control-height')).toBe('2.5rem');
  });
});
