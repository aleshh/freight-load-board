import type { EquipmentType, Load, LoadStatus } from '../../types/load';

export type SortableLoadField = keyof Load | 'ratePerMile';

export interface LoadSort {
  field: SortableLoadField;
  direction: 'asc' | 'desc';
}

export interface LoadFilters {
  company?: string[];
  origin?: string[];
  originState?: string[];
  destination?: string[];
  destinationState?: string[];
  equipmentType?: EquipmentType[];
  status?: LoadStatus[];
  date?: string;
  minWeight?: number;
  maxWeight?: number;
  minPrice?: number;
  maxPrice?: number;
  minDistance?: number;
  maxDistance?: number;
}

export interface LoadQuery {
  search?: string;
  sort?: LoadSort[];
  filters?: LoadFilters;
  page: number;
  pageSize: number;
}

export interface LoadResult {
  items: Load[];
  total: number;
}

export interface LoadFilterOptions {
  companies: string[];
  origins: string[];
  originStates: string[];
  destinations: string[];
  destinationStates: string[];
  equipmentTypes: EquipmentType[];
  statuses: LoadStatus[];
}
