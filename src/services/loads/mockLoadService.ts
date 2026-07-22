import mockLoads from '../../data/mockLoads.json';
import { getRatePerMile, type Load } from '../../types/load';
import type { LoadService } from './loadService';
import type { LoadFilters, LoadQuery, LoadResult, SortableLoadField } from './types';

const searchableFields: (keyof Pick<
  Load,
  'id' | 'company' | 'origin' | 'destination' | 'equipmentType' | 'status'
>)[] = ['id', 'company', 'origin', 'destination', 'equipmentType', 'status'];

function delay(ms: number, signal?: AbortSignal) {
  if (signal?.aborted) return Promise.reject(new DOMException('Request aborted', 'AbortError'));
  if (ms === 0) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timer);
        reject(new DOMException('Request aborted', 'AbortError'));
      },
      { once: true },
    );
  });
}

function includesSearch(load: Load, search?: string) {
  const normalized = search?.trim().toLocaleLowerCase();
  return !normalized || searchableFields.some((field) => String(load[field]).toLocaleLowerCase().includes(normalized));
}

function matchesFilters(load: Load, filters: LoadFilters = {}) {
  return (
    (!filters.company || load.company === filters.company) &&
    (!filters.origin || load.origin === filters.origin) &&
    (!filters.destination || load.destination === filters.destination) &&
    (!filters.equipmentType || load.equipmentType === filters.equipmentType) &&
    (!filters.status || load.status === filters.status) &&
    (!filters.date || load.date === filters.date) &&
    (filters.minWeight === undefined || load.weight >= filters.minWeight) &&
    (filters.maxWeight === undefined || load.weight <= filters.maxWeight) &&
    (filters.minPrice === undefined || load.price >= filters.minPrice) &&
    (filters.maxPrice === undefined || load.price <= filters.maxPrice) &&
    (filters.minDistance === undefined || load.distance >= filters.minDistance) &&
    (filters.maxDistance === undefined || load.distance <= filters.maxDistance)
  );
}

function comparableValue(load: Load, field: SortableLoadField): string | number {
  if (field === 'ratePerMile') return getRatePerMile(load);
  return load[field];
}

function compareValues(left: string | number, right: string | number) {
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' });
}

export function queryLoads(data: Load[], query: LoadQuery): LoadResult {
  const filtered = data.filter((load) => includesSearch(load, query.search) && matchesFilters(load, query.filters));
  const sorted = query.sort?.length
    ? [...filtered].sort((left, right) => {
        for (const sort of query.sort ?? []) {
          const comparison = compareValues(comparableValue(left, sort.field), comparableValue(right, sort.field));
          if (comparison !== 0) return sort.direction === 'asc' ? comparison : -comparison;
        }
        return left.id.localeCompare(right.id, undefined, { numeric: true });
      })
    : filtered;
  const start = (query.page - 1) * query.pageSize;
  return { items: sorted.slice(start, start + query.pageSize), total: sorted.length };
}

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function createMockLoadService(data: Load[] = mockLoads as Load[], latency = 180): LoadService {
  return {
    async getLoads(query, signal) {
      await delay(latency, signal);
      return queryLoads(data, query);
    },
    async getFilterOptions(signal) {
      await delay(latency, signal);
      return {
        companies: uniqueSorted(data.map((load) => load.company)),
        origins: uniqueSorted(data.map((load) => load.origin)),
        destinations: uniqueSorted(data.map((load) => load.destination)),
        equipmentTypes: uniqueSorted(data.map((load) => load.equipmentType)),
        statuses: uniqueSorted(data.map((load) => load.status)),
      };
    },
  };
}

export const mockLoadService = createMockLoadService();

let largeMockLoadServicePromise: Promise<LoadService> | undefined;

export function getMockLoadService(largeDataset: boolean): Promise<LoadService> {
  if (!largeDataset) return Promise.resolve(mockLoadService);
  largeMockLoadServicePromise ??= import('../../data/mockLoads.large.json').then(({ default: data }) =>
    createMockLoadService(data as Load[]),
  );
  return largeMockLoadServicePromise;
}
