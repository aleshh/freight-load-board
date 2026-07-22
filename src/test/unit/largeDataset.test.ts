import { describe, expect, it } from 'vitest';
import standardLoads from '../../data/mockLoads.json';
import largeLoads from '../../data/mockLoads.large.json';

describe('large mock dataset', () => {
  it('contains 10,000 records and begins with the complete standard dataset', () => {
    expect(largeLoads).toHaveLength(10_000);
    expect(largeLoads.slice(0, standardLoads.length)).toEqual(standardLoads);
    expect(new Set(largeLoads.map((load) => load.id)).size).toBe(10_000);
  });
});
