import { X } from 'lucide-react';
import { useEffect, useRef, type KeyboardEvent } from 'react';
import type { LoadFilterOptions, LoadFilters as LoadFilterState } from '../../../services/loads/types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { MultiSelect } from '../../ui/MultiSelect/MultiSelect';
import styles from './Filters.module.css';

interface FiltersProps {
  filters: LoadFilterState;
  options?: LoadFilterOptions;
  onChange: (patch: Partial<LoadFilterState>) => void;
  onClose: () => void;
  open: boolean;
}

function toOptions<T extends string>(values: T[] = []) {
  return values.map((value) => ({ value, label: value }));
}

function optionalNumber(value: string) {
  return value === '' ? undefined : Number(value);
}

export function Filters({ filters, options, onChange, onClose, open }: FiltersProps) {
  const filterGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    filterGridRef.current?.querySelector<HTMLElement>('button:not([disabled]), input:not([disabled])')?.focus();
  }, [open]);

  if (!open) return null;

  const close = () => {
    document.getElementById('load-filters-trigger')?.focus();
    onClose();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    event.preventDefault();
    event.stopPropagation();
    close();
  };

  return (
    <section
      id="load-filters"
      className={styles.root}
      aria-labelledby="filter-heading"
      onKeyDown={handleKeyDown}
    >
      <div className={styles.heading}>
        <div>
          <h2 id="filter-heading">Refine loads</h2>
          <p>Changes apply automatically. Press Escape to close.</p>
        </div>
        <Button variant="icon" aria-label="Close filters" onClick={close}>
          <X size={18} aria-hidden="true" />
        </Button>
      </div>
      <div ref={filterGridRef} className={styles.filterGrid}>
        <MultiSelect
          label="Company"
          values={filters.company}
          options={toOptions(options?.companies)}
          onValuesChange={(company) => onChange({ company })}
          allLabel="All companies"
          searchable
        />
        <MultiSelect
          label="Origin"
          values={filters.origin}
          options={toOptions(options?.origins)}
          onValuesChange={(origin) => onChange({ origin })}
          allLabel="All origins"
          searchable
        />
        <MultiSelect
          label="Destination"
          values={filters.destination}
          options={toOptions(options?.destinations)}
          onValuesChange={(destination) => onChange({ destination })}
          allLabel="All destinations"
          searchable
        />
        <MultiSelect
          label="Equipment"
          values={filters.equipmentType}
          options={toOptions(options?.equipmentTypes)}
          onValuesChange={(equipmentType) => onChange({ equipmentType })}
          allLabel="All equipment"
        />
        <MultiSelect
          label="Status"
          values={filters.status}
          options={toOptions(options?.statuses)}
          onValuesChange={(status) => onChange({ status })}
          allLabel="All statuses"
        />
        <Input
          label="Pickup date"
          type="date"
          value={filters.date ?? ''}
          onChange={(event) => onChange({ date: event.target.value || undefined })}
        />
      </div>
      <div className={styles.rangeGrid}>
        <fieldset className={styles.rangeFieldset}>
          <legend>Weight (lb)</legend>
          <div className={styles.rangeInputs}>
            <Input label="Minimum weight" hideLabel type="number" min="0" placeholder="Minimum" value={filters.minWeight ?? ''} onChange={(event) => onChange({ minWeight: optionalNumber(event.target.value) })} />
            <span aria-hidden="true">to</span>
            <Input label="Maximum weight" hideLabel type="number" min="0" placeholder="Maximum" value={filters.maxWeight ?? ''} onChange={(event) => onChange({ maxWeight: optionalNumber(event.target.value) })} />
          </div>
        </fieldset>
        <fieldset className={styles.rangeFieldset}>
          <legend>Price ($)</legend>
          <div className={styles.rangeInputs}>
            <Input label="Minimum price" hideLabel type="number" min="0" placeholder="Minimum" value={filters.minPrice ?? ''} onChange={(event) => onChange({ minPrice: optionalNumber(event.target.value) })} />
            <span aria-hidden="true">to</span>
            <Input label="Maximum price" hideLabel type="number" min="0" placeholder="Maximum" value={filters.maxPrice ?? ''} onChange={(event) => onChange({ maxPrice: optionalNumber(event.target.value) })} />
          </div>
        </fieldset>
        <fieldset className={styles.rangeFieldset}>
          <legend>Distance (mi)</legend>
          <div className={styles.rangeInputs}>
            <Input label="Minimum distance" hideLabel type="number" min="0" placeholder="Minimum" value={filters.minDistance ?? ''} onChange={(event) => onChange({ minDistance: optionalNumber(event.target.value) })} />
            <span aria-hidden="true">to</span>
            <Input label="Maximum distance" hideLabel type="number" min="0" placeholder="Maximum" value={filters.maxDistance ?? ''} onChange={(event) => onChange({ maxDistance: optionalNumber(event.target.value) })} />
          </div>
        </fieldset>
      </div>
    </section>
  );
}
