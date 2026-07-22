import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ClientSideRowModelModule,
  CellStyleModule,
  ColumnApiModule,
  ModuleRegistry,
  RenderApiModule,
  RowSelectionModule,
  type ColDef,
  type GridApi,
  type GridReadyEvent,
  type SortChangedEvent,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useTheme } from '../../../app/ThemeProvider';
import { getAgGridThemeClass } from '../../../theme/theme';
import type { Load } from '../../../types/load';
import type { LoadSort, SortableLoadField } from '../../../services/loads/types';
import { loadColumnDefinitions } from './columns';
import styles from './Grid.module.css';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CellStyleModule,
  RowSelectionModule,
  ColumnApiModule,
  RenderApiModule,
]);

interface GridProps {
  loads: Load[];
  sort?: LoadSort[];
  onSortChange: (sort?: LoadSort[]) => void;
  loading: boolean;
  announcingLabel: string;
}

export function Grid({ loads, sort, onSortChange, loading, announcingLabel }: GridProps) {
  const { mode } = useTheme();
  const columnDefs = useMemo<ColDef<Load>[]>(() => loadColumnDefinitions, []);
  const defaultColDef = useMemo<ColDef<Load>>(
    () => ({ sortable: true, resizable: true, suppressHeaderMenuButton: true, unSortIcon: true }),
    [],
  );
  const [api, setApi] = useState<GridApi<Load> | null>(null);
  const applyingState = useRef(false);

  const applySortState = useCallback(
    (gridApi: GridApi<Load>) => {
      applyingState.current = true;
      gridApi.applyColumnState({
        state: (sort ?? []).map(({ field, direction }, sortIndex) => ({
          colId: field,
          sort: direction,
          sortIndex,
        })),
        defaultState: { sort: null },
      });
      applyingState.current = false;
    },
    [sort],
  );

  useEffect(() => {
    if (api) applySortState(api);
  }, [api, applySortState]);

  useEffect(() => {
    api?.setGridAriaProperty('label', announcingLabel);
  }, [api, announcingLabel]);

  const onGridReady = ({ api: gridApi }: GridReadyEvent<Load>) => {
    gridApi.setGridAriaProperty('label', announcingLabel);
    setApi(gridApi);
    applySortState(gridApi);
  };

  const onSortChanged = ({ api: gridApi }: SortChangedEvent<Load>) => {
    if (applyingState.current) return;
    const nextSort = gridApi
      .getColumnState()
      .filter((column) => column.sort)
      .sort((left, right) => (left.sortIndex ?? 0) - (right.sortIndex ?? 0))
      .map((column) => ({
        field: column.colId as SortableLoadField,
        direction: column.sort as 'asc' | 'desc',
      }));
    const currentSignature = JSON.stringify(sort ?? []);
    const nextSignature = JSON.stringify(nextSort);
    if (currentSignature !== nextSignature) onSortChange(nextSort.length ? nextSort : undefined);
  };

  return (
    <div className={`${styles.root} ${getAgGridThemeClass(mode)}`} aria-label={announcingLabel}>
      <AgGridReact<Load>
        rowData={loads}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={({ data }) => data.id}
        onGridReady={onGridReady}
        onSortChanged={onSortChanged}
        loading={loading}
        animateRows={false}
        rowSelection={{ mode: 'singleRow', enableClickSelection: true }}
        suppressCellFocus={false}
        ensureDomOrder
        overlayLoadingTemplate={`<span class="${styles.overlay}">Loading freight loads…</span>`}
        overlayNoRowsTemplate={`<span class="${styles.overlay}">No freight loads match the current query.</span>`}
        theme="legacy"
      />
    </div>
  );
}
