import { X } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import type { LoadFilters } from '../../../services/loads/types';
import { currencyFormatter, numberFormatter } from '../../../lib/formatters';
import { Button } from '../../ui/Button/Button';
import styles from './ActiveFilters.module.css';

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
  const chips = [
    ...(search
      ? [{ key: 'search', label: `Search: “${search}”`, removeLabel: `Remove search filter: ${search}`, onRemove: onClearSearch }]
      : []),
    ...active.map(([key, value]) => {
      const formattedValue = displayValue(key, value);
      return {
        key,
        label: `${labels[key]}: ${formattedValue}`,
        removeLabel: `Remove ${labels[key]} filter: ${formattedValue}`,
        onRemove: () => onClearFilter(key),
      };
    }),
  ];
  const chipRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const clearAllRef = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<{ target: 'chip'; index: number } | { target: 'clear-all' } | { target: 'filters' } | undefined>(undefined);

  useLayoutEffect(() => {
    const pending = pendingFocus.current;
    if (!pending) return;

    if (pending.target === 'chip') chipRefs.current[pending.index]?.focus();
    if (pending.target === 'clear-all') clearAllRef.current?.focus();
    if (pending.target === 'filters') document.getElementById('load-filters-trigger')?.focus();
    pendingFocus.current = undefined;
  }, [chips.length]);

  if (chips.length === 0) return null;

  const removeChip = (index: number) => {
    pendingFocus.current = index < chips.length - 1
      ? { target: 'chip', index }
      : chips.length > 1
        ? { target: 'clear-all' }
        : { target: 'filters' };
    chips[index].onRemove();
  };

  const clearAll = () => {
    pendingFocus.current = { target: 'filters' };
    onClearAll();
  };

  return (
    <div className={styles.root} role="group" aria-label="Active search and filters">
      <span className={styles.label}>Active:</span>
      {chips.map((chip, index) => (
        <Button
          key={chip.key}
          ref={(node) => { chipRefs.current[index] = node; }}
          variant="compact"
          onClick={() => removeChip(index)}
          aria-label={chip.removeLabel}
        >
          {chip.label} <X size={14} aria-hidden="true" />
        </Button>
      ))}
      <Button ref={clearAllRef} variant="ghost" onClick={clearAll}>Clear all</Button>
    </div>
  );
}
