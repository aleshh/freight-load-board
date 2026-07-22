import { AlertCircle, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDatasetPreference } from '../../../app/DatasetProvider';
import { useLoadFilterOptions, useLoads } from '../../../hooks/useLoads';
import { useLoadQueryState } from '../../../hooks/useLoadQueryState';
import type { LoadFilters as LoadFilterState } from '../../../services/loads/types';
import { Button } from '../../ui/Button/Button';
import { ActiveFilters } from '../ActiveFilters/ActiveFilters';
import { Filters } from '../Filters/Filters';
import { Grid } from '../Grid/Grid';
import { Pagination } from '../Pagination/Pagination';
import { Toolbar } from '../Toolbar/Toolbar';
import styles from './LoadBoard.module.css';

export function LoadBoard() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { largeDataset } = useDatasetPreference();
  const { query, setSearch, setFilters, clearAll, setSort, setPage, setPageSize, activeFilterCount } = useLoadQueryState();
  const previousDataset = useRef(largeDataset);
  const loadsQuery = useLoads(query, largeDataset);
  const optionsQuery = useLoadFilterOptions(largeDataset);
  const total = loadsQuery.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / query.pageSize));
  const resultLabel = loadsQuery.isFetching
    ? 'Updating freight loads.'
    : `${total} freight ${total === 1 ? 'load' : 'loads'} found.`;

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
          open={filtersOpen}
        />
        <ActiveFilters
          search={query.search}
          filters={query.filters ?? {}}
          onClearSearch={() => setSearch(undefined)}
          onClearFilter={clearFilter}
          onClearAll={clearAll}
        />

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{resultLabel}</p>

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
              loads={loadsQuery.data?.items ?? []}
              sort={query.sort}
              onSortChange={setSort}
              loading={loadsQuery.isLoading}
              announcingLabel={`Freight loads data grid. ${resultLabel}`}
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
