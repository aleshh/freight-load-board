import { AlertCircle, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDatasetPreference } from '../../../app/DatasetProvider';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { useLoadFilterOptions, useLoads } from '../../../hooks/useLoads';
import { useLoadQueryState } from '../../../hooks/useLoadQueryState';
import { numberFormatter } from '../../../lib/formatters';
import type { LoadFilters as LoadFilterState } from '../../../services/loads/types';
import { Button } from '../../ui/Button/Button';
import { ActiveFilters } from '../ActiveFilters/ActiveFilters';
import { Filters } from '../Filters/Filters';
import { Grid, type GridColumnState, type GridHandle } from '../Grid/Grid';
import { Pagination } from '../Pagination/Pagination';
import { Toolbar } from '../Toolbar/Toolbar';
import styles from './LoadBoard.module.css';

export function LoadBoard() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [columns, setColumns] = useState<GridColumnState[]>([]);
  const gridRef = useRef<GridHandle>(null);
  const { largeDataset } = useDatasetPreference();
  const { query, setSearch, setFilters, clearAll, setSort, setPage, setPageSize, activeFilterCount } = useLoadQueryState();
  const previousDataset = useRef(largeDataset);
  const loadsQuery = useLoads(query, largeDataset);
  const optionsQuery = useLoadFilterOptions(largeDataset);
  const total = loadsQuery.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / query.pageSize));
  const first = total === 0 ? 0 : (query.page - 1) * query.pageSize + 1;
  const last = Math.min(query.page * query.pageSize, total);
  const resultSummary = `${numberFormatter.format(total)} freight ${total === 1 ? 'load' : 'loads'} found.`;
  const settledResultAnnouncement = `${resultSummary} Page ${query.page} of ${pageCount}. ${total === 0
    ? 'No loads to show.'
    : `Showing ${numberFormatter.format(first)} through ${numberFormatter.format(last)}.`}`;
  const resultAnnouncement = useDebouncedValue(
    loadsQuery.isFetching ? '' : settledResultAnnouncement,
    500,
  );

  useEffect(() => {
    if (loadsQuery.data && query.page > pageCount) setPage(pageCount);
  }, [loadsQuery.data, pageCount, query.page, setPage]);

  useEffect(() => {
    if (previousDataset.current !== largeDataset) {
      previousDataset.current = largeDataset;
      setPage(1);
    }
  }, [largeDataset, setPage]);

  const clearFilter = (key: keyof LoadFilterState) => setFilters({ [key]: undefined });
  const toolbarTarget = document.getElementById('load-board-toolbar');
  const toolbar = (
    <Toolbar
      search={query.search}
      onSearchChange={setSearch}
      filtersOpen={filtersOpen}
      onFiltersOpenChange={setFiltersOpen}
      activeFilterCount={activeFilterCount}
      columns={columns}
      onColumnVisibilityChange={(id, visible) => gridRef.current?.setColumnVisible(id, visible)}
      onColumnPinnedChange={(id, pinned) => gridRef.current?.setColumnPinned(id, pinned)}
      onResetColumns={() => gridRef.current?.resetColumns()}
    />
  );

  return (
    <section className={styles.root} aria-labelledby="load-board-heading">
      <h1 id="load-board-heading" className="sr-only">Freight load board</h1>
      {toolbarTarget ? createPortal(toolbar, toolbarTarget) : toolbar}
      <div className={styles.panel}>
        <Filters
          filters={query.filters ?? {}}
          options={optionsQuery.data}
          onChange={setFilters}
          onClose={() => setFiltersOpen(false)}
          open={filtersOpen}
        />
        <ActiveFilters
          search={query.search}
          filters={query.filters ?? {}}
          onClearSearch={() => setSearch(undefined)}
          onClearFilter={clearFilter}
          onClearAll={clearAll}
        />

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{resultAnnouncement}</p>

        {loadsQuery.isError ? (
          <div className={styles.error} role="alert">
            <AlertCircle size={26} aria-hidden="true" />
            <div>
              <h2>Loads could not be retrieved</h2>
              <p>Please check your connection and try again.</p>
            </div>
            <Button variant="secondary" onClick={() => loadsQuery.refetch()}>
              <RefreshCw size={17} aria-hidden="true" /> Retry
            </Button>
          </div>
        ) : (
          <>
            <Grid
              ref={gridRef}
              loads={loadsQuery.data?.items ?? []}
              sort={query.sort}
              onSortChange={setSort}
              loading={loadsQuery.isLoading}
              announcingLabel={`Freight loads data grid. ${resultSummary}`}
              onColumnStateChange={setColumns}
            />
            <Pagination
              page={query.page}
              pageSize={query.pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </>
        )}
      </div>
    </section>
  );
}
