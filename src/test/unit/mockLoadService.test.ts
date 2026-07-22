import { describe, expect, it } from 'vitest';
import { queryLoads } from '../../services/loads/mockLoadService';
import type { Load } from '../../types/load';

const loads: Load[] = [
  { id: 'LD-2', company: 'Beta Freight', origin: 'Denver, CO', destination: 'Dallas, TX', weight: 42000, equipmentType: 'Dry Van', date: '2026-07-22', price: 2400, distance: 800, status: 'Available' },
  { id: 'LD-1', company: 'Alpha Cargo', origin: 'Boise, ID', destination: 'Denver, CO', weight: 30000, equipmentType: 'Reefer', date: '2026-07-21', price: 1800, distance: 400, status: 'Pending' },
  { id: 'LD-3', company: 'Alpha Cargo', origin: 'Denver, CO', destination: 'Omaha, NE', weight: 38000, equipmentType: 'Flatbed', date: '2026-07-23', price: 2750, distance: 500, status: 'Available' },
];

describe('queryLoads', () => {
  it('searches relevant fields case-insensitively with partial values', () => {
    const result = queryLoads(loads, { search: 'alpHa', page: 1, pageSize: 25 });
    expect(result.items.map((load) => load.id)).toEqual(['LD-1', 'LD-3']);
  });

  it('combines field and range filters', () => {
    const result = queryLoads(loads, {
      filters: { origin: ['Denver, CO'], status: ['Available'], minWeight: 40000 },
      page: 1,
      pageSize: 25,
    });
    expect(result.items.map((load) => load.id)).toEqual(['LD-2']);
  });

  it('ORs values within a categorical filter and ANDs across filter categories', () => {
    const result = queryLoads(loads, {
      filters: { status: ['Available', 'Pending'], equipmentType: ['Reefer', 'Flatbed'] },
      page: 1,
      pageSize: 25,
    });
    expect(result.items.map((load) => load.id)).toEqual(['LD-1', 'LD-3']);
  });

  it('supports multi-column server-shaped sorting', () => {
    const result = queryLoads(loads, {
      sort: [
        { field: 'company', direction: 'asc' },
        { field: 'price', direction: 'desc' },
      ],
      page: 1,
      pageSize: 25,
    });
    expect(result.items.map((load) => load.id)).toEqual(['LD-3', 'LD-1', 'LD-2']);
  });

  it('returns the filtered total while paginating the items', () => {
    const result = queryLoads(loads, { page: 2, pageSize: 2 });
    expect(result.total).toBe(3);
    expect(result.items.map((load) => load.id)).toEqual(['LD-3']);
  });

  it('sorts the derived rate-per-mile value', () => {
    const result = queryLoads(loads, {
      sort: [{ field: 'ratePerMile', direction: 'desc' }],
      page: 1,
      pageSize: 25,
    });
    expect(result.items.map((load) => load.id)).toEqual(['LD-3', 'LD-1', 'LD-2']);
  });
});
