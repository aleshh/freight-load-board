import { AlertCircle, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLoadFilterOptions, useLoads } from '../../hooks/useLoads';
import { useLoadQueryState } from '../../hooks/useLoadQueryState';
import type { LoadFilters as LoadFilterState } from '../../services/loads/types';
import { AppButton } from '../ui/AppButton';
import { ActiveFilters } from './ActiveFilters';
import { LoadFilters } from './LoadFilters';
import { LoadGrid } from './LoadGrid';
import { LoadPagination } from './LoadPagination';
import { LoadToolbar } from './LoadToolbar';

export function LoadBoard() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { query, setSearch, setFilters, clearAll, setSort, setPage, setPageSize, activeFilterCount } = useLoadQueryState();
  const loadsQuery = useLoads(query);
  const optionsQuery = useLoadFilterOptions();
  const total = loadsQuery.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / query.pageSize));
  const resultLabel = loadsQuery.isFetching
    ? 'Updating freight loads.'
    : `${total} freight ${total === 1 ? 'load' : 'loads'} found.`;

  useEffect(() => {
    if (loadsQuery.data && query.page > pageCount) setPage(pageCount);
  }, [loadsQuery.data, pageCount, query.page, setPage]);

  const clearFilter = (key: keyof LoadFilterState) => setFilters({ [key]: undefined });

  return (
    <section className="load-board" aria-labelledby="load-board-heading">
      <div className="load-board__heading">
        <div>
          <p className="eyebrow">Dispatch workspace</p>
          <h1 id="load-board-heading">Freight load board</h1>
          <p>Find and compare available freight across the network.</p>
        </div>
        <div className="board-summary" aria-label="Load summary">
          <strong>{total}</strong>
          <span>matching loads</span>
        </div>
      </div>

      <div className="load-board__panel">
        <LoadToolbar
          search={query.search}
          onSearchChange={setSearch}
          filtersOpen={filtersOpen}
          onFiltersOpenChange={setFiltersOpen}
          activeFilterCount={activeFilterCount}
        />
        <LoadFilters
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
          <div className="error-state" role="alert">
            <AlertCircle size={26} aria-hidden="true" />
            <div>
              <h2>Loads could not be retrieved</h2>
              <p>Please check your connection and try again.</p>
            </div>
            <AppButton variant="secondary" onClick={() => loadsQuery.refetch()}>
              <RefreshCw size={17} aria-hidden="true" /> Retry
            </AppButton>
          </div>
        ) : (
          <>
            <div className="grid-status-bar">
              <span>{loadsQuery.isFetching && !loadsQuery.isLoading ? 'Updating results…' : resultLabel}</span>
              <span>Use arrow keys to move through grid cells.</span>
            </div>
            <LoadGrid
              loads={loadsQuery.data?.items ?? []}
              sort={query.sort}
              onSortChange={setSort}
              loading={loadsQuery.isLoading}
              announcingLabel={`Freight loads data grid. ${resultLabel}`}
            />
            <LoadPagination
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
