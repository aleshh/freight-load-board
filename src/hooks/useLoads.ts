import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getMockLoadService } from '../services/loads/mockLoadService';
import type { LoadQuery } from '../services/loads/types';

export function useLoads(query: LoadQuery, largeDataset: boolean) {
  return useQuery({
    queryKey: ['loads', largeDataset ? 'large' : 'standard', query],
    queryFn: async ({ signal }) => (await getMockLoadService(largeDataset)).getLoads(query, signal),
    placeholderData: keepPreviousData,
  });
}

export function useLoadFilterOptions(largeDataset: boolean) {
  return useQuery({
    queryKey: ['load-filter-options', largeDataset ? 'large' : 'standard'],
    queryFn: async ({ signal }) => (await getMockLoadService(largeDataset)).getFilterOptions(signal),
    staleTime: Number.POSITIVE_INFINITY,
  });
}
