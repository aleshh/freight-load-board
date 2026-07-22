import { describe, expect, it } from 'vitest';
import { parseLocation } from '../../lib/locations';

describe('parseLocation', () => {
  it('separates a mock city and state value', () => {
    expect(parseLocation('Denver, CO')).toEqual({ city: 'Denver', state: 'CO' });
  });

  it('preserves an unstructured location without inventing a state', () => {
    expect(parseLocation('Remote facility')).toEqual({ city: 'Remote facility' });
  });
});
