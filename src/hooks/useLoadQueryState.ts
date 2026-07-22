import { useCallback, useEffect, useMemo, useState } from 'react';
import type { EquipmentType, LoadStatus } from '../types/load';
import type { LoadFilters, LoadQuery, LoadSort, SortableLoadField } from '../services/loads/types';

const DEFAULT_PAGE_SIZE = 25;
const numericFilterKeys = [
  'minWeight',
  'maxWeight',
  'minPrice',
  'maxPrice',
  'minDistance',
  'maxDistance',
] as const;
const categoricalFilterNames = {
  company: 'company',
  origin: 'origin',
  destination: 'destination',
  equipmentType: 'equipment',
  status: 'status',
} as const;

function positiveNumber(value: string | null, fallback: number) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}

function parseSort(value: string | null): LoadSort[] | undefined {
  if (!value) return undefined;
  const result = value.split(',').flatMap((part) => {
    const [field, direction] = part.split(':');
    return field && (direction === 'asc' || direction === 'desc')
      ? [{ field: field as SortableLoadField, direction: direction as 'asc' | 'desc' }]
      : [];
  });
  return result.length ? result : undefined;
}

function values(searchParams: URLSearchParams, name: string) {
  const result = searchParams.getAll(name).filter(Boolean);
  return result.length ? result : undefined;
}

export function parseLoadQuery(searchParams: URLSearchParams): LoadQuery {
  const filters: LoadFilters = {
    company: values(searchParams, 'company'),
    origin: values(searchParams, 'origin'),
    destination: values(searchParams, 'destination'),
    equipmentType: values(searchParams, 'equipment') as EquipmentType[] | undefined,
    status: values(searchParams, 'status') as LoadStatus[] | undefined,
    date: searchParams.get('date') || undefined,
  };

  numericFilterKeys.forEach((key) => {
    const raw = searchParams.get(key);
    if (raw !== null && Number.isFinite(Number(raw))) filters[key] = Number(raw);
  });

  return {
    search: searchParams.get('q') || undefined,
    sort: parseSort(searchParams.get('sort')),
    filters,
    page: positiveNumber(searchParams.get('page'), 1),
    pageSize: positiveNumber(searchParams.get('pageSize'), DEFAULT_PAGE_SIZE),
  };
}

export function toLoadSearchParams(query: LoadQuery) {
  const params = new URLSearchParams();
  if (query.search) params.set('q', query.search);
  if (query.sort?.length) params.set('sort', query.sort.map(({ field, direction }) => `${field}:${direction}`).join(','));
  if (query.page > 1) params.set('page', String(query.page));
  if (query.pageSize !== DEFAULT_PAGE_SIZE) params.set('pageSize', String(query.pageSize));

  const filters = query.filters ?? {};
  Object.entries(categoricalFilterNames).forEach(([key, name]) => {
    filters[key as keyof typeof categoricalFilterNames]?.forEach((value) => params.append(name, value));
  });
  if (filters.date) params.set('date', filters.date);
  numericFilterKeys.forEach((key) => {
    const value = filters[key];
    if (value !== undefined) params.set(key, String(value));
  });
  return params;
}

export function useLoadQueryState() {
  const [query, setQuery] = useState<LoadQuery>(() => parseLoadQuery(new URLSearchParams(window.location.search)));

  useEffect(() => {
    const handlePopState = () => setQuery(parseLoadQuery(new URLSearchParams(window.location.search)));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const params = toLoadSearchParams(query);
    const nextUrl = `${window.location.pathname}${params.size ? `?${params}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', nextUrl);
  }, [query]);

  const setSearch = useCallback((search?: string) => {
    setQuery((current) => ({ ...current, search: search?.trim() || undefined, page: 1 }));
  }, []);

  const setFilters = useCallback((patch: Partial<LoadFilters>) => {
    setQuery((current) => {
      const filters = { ...current.filters, ...patch };
      Object.keys(filters).forEach((key) => {
        const value = filters[key as keyof LoadFilters];
        if (value === undefined || (Array.isArray(value) && value.length === 0)) delete filters[key as keyof LoadFilters];
      });
      return { ...current, filters, page: 1 };
    });
  }, []);

  const clearAll = useCallback(() => {
    setQuery((current) => ({ ...current, search: undefined, filters: {}, page: 1 }));
  }, []);

  const setSort = useCallback((sort?: LoadSort[]) => {
    setQuery((current) => ({ ...current, sort, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setQuery((current) => ({ ...current, page: Math.max(1, page) }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setQuery((current) => ({ ...current, pageSize, page: 1 }));
  }, []);

  const activeFilterCount = useMemo(
    () => Object.values(query.filters ?? {}).filter((value) => value !== undefined && (!Array.isArray(value) || value.length > 0)).length + (query.search ? 1 : 0),
    [query.filters, query.search],
  );

  return { query, setSearch, setFilters, clearAll, setSort, setPage, setPageSize, activeFilterCount };
}
