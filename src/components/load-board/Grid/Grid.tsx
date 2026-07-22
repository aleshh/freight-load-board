import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ClientSideRowModelModule,
  CellStyleModule,
  ColumnApiModule,
  ModuleRegistry,
  RenderApiModule,
  type ColDef,
  type ColumnMovedEvent,
  type ColumnPinnedEvent,
  type ColumnVisibleEvent,
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
  ColumnApiModule,
  RenderApiModule,
]);

interface GridProps {
  loads: Load[];
  sort?: LoadSort[];
  onSortChange: (sort?: LoadSort[]) => void;
  loading: boolean;
  announcingLabel: string;
  onColumnStateChange: (columns: GridColumnState[]) => void;
}

export interface GridColumnState {
  id: string;
  label: string;
  visible: boolean;
  pinned: boolean;
}

export interface GridHandle {
  setColumnVisible: (id: string, visible: boolean) => void;
  setColumnPinned: (id: string, pinned: boolean) => void;
  resetColumns: () => void;
}

export const Grid = forwardRef<GridHandle, GridProps>(function Grid(
  { loads, sort, onSortChange, loading, announcingLabel, onColumnStateChange },
  ref,
) {
  const { mode } = useTheme();
  const columnDefs = useMemo<ColDef<Load>[]>(() => loadColumnDefinitions, []);
  const defaultColDef = useMemo<ColDef<Load>>(
    () => ({ sortable: true, resizable: true, suppressHeaderMenuButton: true, unSortIcon: true }),
    [],
  );
  const [api, setApi] = useState<GridApi<Load> | null>(null);
  const applyingState = useRef(false);

  const publishColumnState = useCallback(
    (gridApi: GridApi<Load>) => {
      onColumnStateChange(
        gridApi.getColumnState().map((column) => ({
          id: column.colId,
          label: gridApi.getColumnDef(column.colId)?.headerName ?? column.colId,
          visible: !column.hide,
          pinned: Boolean(column.pinned),
        })),
      );
    },
    [onColumnStateChange],
  );

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

  useImperativeHandle(ref, () => ({
    setColumnVisible(id, visible) {
      if (!api) return;
      api.applyColumnState({ state: [{ colId: id, hide: !visible, ...(visible ? {} : { pinned: null }) }] });
      publishColumnState(api);
    },
    setColumnPinned(id, pinned) {
      if (!api) return;
      api.setColumnsPinned([id], pinned ? 'left' : null);
      publishColumnState(api);
    },
    resetColumns() {
      if (!api) return;
      applyingState.current = true;
      api.resetColumnState();
      applySortState(api);
      applyingState.current = false;
      publishColumnState(api);
    },
  }), [api, applySortState, publishColumnState]);

  const onGridReady = ({ api: gridApi }: GridReadyEvent<Load>) => {
    gridApi.setGridAriaProperty('label', announcingLabel);
    setApi(gridApi);
    applySortState(gridApi);
    publishColumnState(gridApi);
  };

  const onColumnsChanged = ({ api: gridApi }: ColumnVisibleEvent<Load> | ColumnPinnedEvent<Load> | ColumnMovedEvent<Load>) => {
    publishColumnState(gridApi);
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
        onColumnVisible={onColumnsChanged}
        onColumnPinned={onColumnsChanged}
        onColumnMoved={onColumnsChanged}
        loading={loading}
        animateRows={false}
        suppressCellFocus={false}
        suppressColumnVirtualisation
        suppressRowVirtualisation
        ensureDomOrder
        overlayLoadingTemplate={`<span class="${styles.overlay}">Loading freight loads…</span>`}
        overlayNoRowsTemplate={`<span class="${styles.overlay}">No freight loads match the current query.</span>`}
        theme="legacy"
      />
    </div>
  );
});

Grid.displayName = 'Grid';
