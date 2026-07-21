import type { LoadFilterOptions, LoadQuery, LoadResult } from './types';

export interface LoadService {
  getLoads(query: LoadQuery, signal?: AbortSignal): Promise<LoadResult>;
  getFilterOptions(signal?: AbortSignal): Promise<LoadFilterOptions>;
}
