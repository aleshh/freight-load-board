import type { EquipmentType, LoadStatus } from '../../../types/load';
import type { LoadFilterOptions, LoadFilters as LoadFilterState } from '../../../services/loads/types';
import { Input } from '../../ui/Input/Input';
import { Select } from '../../ui/Select/Select';
import styles from './Filters.module.css';

interface FiltersProps {
  filters: LoadFilterState;
  options?: LoadFilterOptions;
  onChange: (patch: Partial<LoadFilterState>) => void;
  open: boolean;
}

function toOptions(values: string[] = []) {
  return values.map((value) => ({ value, label: value }));
}

function optionalNumber(value: string) {
  return value === '' ? undefined : Number(value);
}

export function Filters({ filters, options, onChange, open }: FiltersProps) {
  if (!open) return null;

  return (
    <section id="load-filters" className={styles.root} aria-labelledby="filter-heading">
      <div className={styles.heading}>
        <div>
          <h2 id="filter-heading">Refine loads</h2>
          <p>Filters combine to narrow the results.</p>
        </div>
      </div>
      <div className={styles.filterGrid}>
        <Select
          label="Company"
          value={filters.company}
          options={toOptions(options?.companies)}
          onValueChange={(company) => onChange({ company })}
          allLabel="All companies"
        />
        <Select
          label="Origin"
          value={filters.origin}
          options={toOptions(options?.origins)}
          onValueChange={(origin) => onChange({ origin })}
          allLabel="All origins"
        />
        <Select
          label="Destination"
          value={filters.destination}
          options={toOptions(options?.destinations)}
          onValueChange={(destination) => onChange({ destination })}
          allLabel="All destinations"
        />
        <Select
          label="Equipment"
          value={filters.equipmentType}
          options={toOptions(options?.equipmentTypes)}
          onValueChange={(equipmentType) => onChange({ equipmentType: equipmentType as EquipmentType | undefined })}
          allLabel="All equipment"
        />
        <Select
          label="Status"
          value={filters.status}
          options={toOptions(options?.statuses)}
          onValueChange={(status) => onChange({ status: status as LoadStatus | undefined })}
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
