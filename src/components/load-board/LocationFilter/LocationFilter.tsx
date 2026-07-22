import { useEffect, useState } from 'react';
import { MultiSelect } from '../../ui/MultiSelect/MultiSelect';
import styles from './LocationFilter.module.css';

type LocationMode = 'city' | 'state';

interface LocationFilterProps {
  label: 'Origin' | 'Destination';
  cityValues?: string[];
  stateValues?: string[];
  cities?: string[];
  states?: string[];
  onCityValuesChange: (values: string[] | undefined) => void;
  onStateValuesChange: (values: string[] | undefined) => void;
}

function toOptions(values: string[] = []) {
  return values.map((value) => ({ value, label: value }));
}

export function LocationFilter({
  label,
  cityValues,
  stateValues,
  cities,
  states,
  onCityValuesChange,
  onStateValuesChange,
}: LocationFilterProps) {
  const [mode, setMode] = useState<LocationMode>(stateValues?.length ? 'state' : 'city');

  useEffect(() => {
    if (stateValues?.length) setMode('state');
    else if (cityValues?.length) setMode('city');
  }, [cityValues, stateValues]);

  const changeMode = (nextMode: LocationMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    if (nextMode === 'city') onStateValuesChange(undefined);
    else onCityValuesChange(undefined);
  };

  const panelControls = (
    <div className={styles.modeControl}>
      <span>Filter by</span>
      <div className={styles.modeButtons} role="group" aria-label={`Filter ${label.toLocaleLowerCase()} by`}>
        <button type="button" aria-pressed={mode === 'city'} onClick={() => changeMode('city')}>City</button>
        <button type="button" aria-pressed={mode === 'state'} onClick={() => changeMode('state')}>State</button>
      </div>
    </div>
  );

  return (
    <MultiSelect
      label={label}
      values={mode === 'city' ? cityValues : stateValues}
      options={toOptions(mode === 'city' ? cities : states)}
      onValuesChange={mode === 'city' ? onCityValuesChange : onStateValuesChange}
      allLabel={mode === 'city' ? 'All cities' : 'All states'}
      searchable={mode === 'city'}
      panelControls={panelControls}
    />
  );
}
