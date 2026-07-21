import { describe, expect, it } from 'vitest';
import { currencyFormatter, formatDate, numberFormatter } from '../../lib/formatters';

describe('formatters', () => {
  it('formats money, dates, and measurements consistently', () => {
    expect(currencyFormatter.format(2840)).toBe('$2,840');
    expect(numberFormatter.format(38500)).toBe('38,500');
    expect(formatDate('2026-07-21')).toBe('Jul 21, 2026');
  });
});
