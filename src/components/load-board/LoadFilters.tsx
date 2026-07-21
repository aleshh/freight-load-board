import type { EquipmentType, LoadStatus } from '../../types/load';
import type { LoadFilterOptions, LoadFilters as LoadFilterState } from '../../services/loads/types';
import { AppInput } from '../ui/AppInput';
import { AppSelect } from '../ui/AppSelect';

interface LoadFiltersProps {
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

export function LoadFilters({ filters, options, onChange, open }: LoadFiltersProps) {
  if (!open) return null;

  return (
    <section id="load-filters" className="load-filters" aria-labelledby="filter-heading">
      <div className="section-heading">
        <div>
          <h2 id="filter-heading">Refine loads</h2>
          <p>Filters combine to narrow the results.</p>
        </div>
      </div>
      <div className="filter-grid">
        <AppSelect
          label="Company"
          value={filters.company}
          options={toOptions(options?.companies)}
          onValueChange={(company) => onChange({ company })}
          allLabel="All companies"
        />
        <AppSelect
          label="Origin"
          value={filters.origin}
          options={toOptions(options?.origins)}
          onValueChange={(origin) => onChange({ origin })}
          allLabel="All origins"
        />
        <AppSelect
          label="Destination"
          value={filters.destination}
          options={toOptions(options?.destinations)}
          onValueChange={(destination) => onChange({ destination })}
          allLabel="All destinations"
        />
        <AppSelect
          label="Equipment"
          value={filters.equipmentType}
          options={toOptions(options?.equipmentTypes)}
          onValueChange={(equipmentType) => onChange({ equipmentType: equipmentType as EquipmentType | undefined })}
          allLabel="All equipment"
        />
        <AppSelect
          label="Status"
          value={filters.status}
          options={toOptions(options?.statuses)}
          onValueChange={(status) => onChange({ status: status as LoadStatus | undefined })}
          allLabel="All statuses"
        />
        <AppInput
          label="Pickup date"
          type="date"
          value={filters.date ?? ''}
          onChange={(event) => onChange({ date: event.target.value || undefined })}
        />
      </div>
      <div className="range-filter-grid">
        <fieldset className="range-fieldset">
          <legend>Weight (lb)</legend>
          <div className="range-fieldset__inputs">
            <AppInput label="Minimum weight" hideLabel type="number" min="0" placeholder="Minimum" value={filters.minWeight ?? ''} onChange={(event) => onChange({ minWeight: optionalNumber(event.target.value) })} />
            <span aria-hidden="true">to</span>
            <AppInput label="Maximum weight" hideLabel type="number" min="0" placeholder="Maximum" value={filters.maxWeight ?? ''} onChange={(event) => onChange({ maxWeight: optionalNumber(event.target.value) })} />
          </div>
        </fieldset>
        <fieldset className="range-fieldset">
          <legend>Price ($)</legend>
          <div className="range-fieldset__inputs">
            <AppInput label="Minimum price" hideLabel type="number" min="0" placeholder="Minimum" value={filters.minPrice ?? ''} onChange={(event) => onChange({ minPrice: optionalNumber(event.target.value) })} />
            <span aria-hidden="true">to</span>
            <AppInput label="Maximum price" hideLabel type="number" min="0" placeholder="Maximum" value={filters.maxPrice ?? ''} onChange={(event) => onChange({ maxPrice: optionalNumber(event.target.value) })} />
          </div>
        </fieldset>
        <fieldset className="range-fieldset">
          <legend>Distance (mi)</legend>
          <div className="range-fieldset__inputs">
            <AppInput label="Minimum distance" hideLabel type="number" min="0" placeholder="Minimum" value={filters.minDistance ?? ''} onChange={(event) => onChange({ minDistance: optionalNumber(event.target.value) })} />
            <span aria-hidden="true">to</span>
            <AppInput label="Maximum distance" hideLabel type="number" min="0" placeholder="Maximum" value={filters.maxDistance ?? ''} onChange={(event) => onChange({ maxDistance: optionalNumber(event.target.value) })} />
          </div>
        </fieldset>
      </div>
    </section>
  );
}
