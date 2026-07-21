import { X } from 'lucide-react';
import type { LoadFilters } from '../../services/loads/types';
import { currencyFormatter, numberFormatter } from '../../lib/formatters';
import { AppButton } from '../ui/AppButton';

interface ActiveFiltersProps {
  search?: string;
  filters: LoadFilters;
  onClearSearch: () => void;
  onClearFilter: (key: keyof LoadFilters) => void;
  onClearAll: () => void;
}

const labels: Record<keyof LoadFilters, string> = {
  company: 'Company',
  origin: 'Origin',
  destination: 'Destination',
  equipmentType: 'Equipment',
  status: 'Status',
  date: 'Date',
  minWeight: 'Min weight',
  maxWeight: 'Max weight',
  minPrice: 'Min price',
  maxPrice: 'Max price',
  minDistance: 'Min distance',
  maxDistance: 'Max distance',
};

function displayValue(key: keyof LoadFilters, value: string | number) {
  if (key === 'minPrice' || key === 'maxPrice') return currencyFormatter.format(Number(value));
  if (key === 'minWeight' || key === 'maxWeight') return `${numberFormatter.format(Number(value))} lb`;
  if (key === 'minDistance' || key === 'maxDistance') return `${numberFormatter.format(Number(value))} mi`;
  return value;
}

export function ActiveFilters({ search, filters, onClearSearch, onClearFilter, onClearAll }: ActiveFiltersProps) {
  const active = Object.entries(filters).filter((entry): entry is [keyof LoadFilters, string | number] => entry[1] !== undefined && entry[1] !== '');
  if (!search && active.length === 0) return null;

  return (
    <div className="active-filters" aria-label="Active search and filters">
      <span className="active-filters__label">Active:</span>
      {search ? (
        <AppButton variant="compact" onClick={onClearSearch} aria-label={`Remove search filter: ${search}`}>
          Search: “{search}” <X size={14} aria-hidden="true" />
        </AppButton>
      ) : null}
      {active.map(([key, value]) => (
        <AppButton key={key} variant="compact" onClick={() => onClearFilter(key)} aria-label={`Remove ${labels[key]} filter: ${value}`}>
          {labels[key]}: {displayValue(key, value)} <X size={14} aria-hidden="true" />
        </AppButton>
      ))}
      <AppButton variant="ghost" onClick={onClearAll}>Clear all</AppButton>
    </div>
  );
}
