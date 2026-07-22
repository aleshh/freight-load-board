import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AppButton } from '../ui/AppButton';
import { AppSelect } from '../ui/AppSelect';

interface LoadPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const pageSizeOptions = [10, 25, 50, 100].map((size) => ({ value: String(size), label: String(size) }));

export function LoadPagination({ page, pageSize, total, onPageChange, onPageSizeChange }: LoadPaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav className="load-pagination" aria-label="Load results pagination">
      <p className="load-pagination__summary">
        {numberWithCommas(total)} freight {total === 1 ? 'load' : 'loads'} found · Showing {numberWithCommas(first)}–{numberWithCommas(last)}
      </p>
      <div className="load-pagination__controls">
        <AppSelect
          label="Rows per page"
          value={String(pageSize)}
          options={pageSizeOptions}
          onValueChange={(value) => value && onPageSizeChange(Number(value))}
        />
        <span className="load-pagination__page">Page {page} of {pageCount}</span>
        <AppButton variant="icon" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft size={18} aria-hidden="true" />
        </AppButton>
        <AppButton variant="icon" aria-label="Next page" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
          <ChevronRight size={18} aria-hidden="true" />
        </AppButton>
      </div>
    </nav>
  );
}

function numberWithCommas(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}
