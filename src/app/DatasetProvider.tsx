import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

const DATASET_STORAGE_KEY = 'freight-large-dataset';

interface DatasetContextValue {
  largeDataset: boolean;
  setLargeDataset: (enabled: boolean) => void;
}

const DatasetContext = createContext<DatasetContextValue | null>(null);

function getInitialValue() {
  return localStorage.getItem(DATASET_STORAGE_KEY) === 'true';
}

export function DatasetProvider({ children }: PropsWithChildren) {
  const [largeDataset, setLargeDatasetState] = useState(getInitialValue);

  const value = useMemo<DatasetContextValue>(
    () => ({
      largeDataset,
      setLargeDataset(enabled) {
        localStorage.setItem(DATASET_STORAGE_KEY, String(enabled));
        setLargeDatasetState(enabled);
      },
    }),
    [largeDataset],
  );

  return <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>;
}

export function useDatasetPreference() {
  const value = useContext(DatasetContext);
  if (!value) throw new Error('useDatasetPreference must be used within DatasetProvider');
  return value;
}
