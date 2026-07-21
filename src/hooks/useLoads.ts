import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { mockLoadService } from '../services/loads/mockLoadService';
import type { LoadQuery } from '../services/loads/types';

export function useLoads(query: LoadQuery) {
  return useQuery({
    queryKey: ['loads', query],
    queryFn: ({ signal }) => mockLoadService.getLoads(query, signal),
    placeholderData: keepPreviousData,
  });
}

export function useLoadFilterOptions() {
  return useQuery({
    queryKey: ['load-filter-options'],
    queryFn: ({ signal }) => mockLoadService.getFilterOptions(signal),
    staleTime: Number.POSITIVE_INFINITY,
  });
}
