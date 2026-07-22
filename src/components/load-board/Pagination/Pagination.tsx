import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/Button/Button';
import { Select } from '../../ui/Select/Select';
import styles from './Pagination.module.css';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const pageSizeOptions = [10, 25, 50, 100].map((size) => ({ value: String(size), label: String(size) }));

export function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav id="load-pagination" className={styles.root} aria-label="Load results pagination" tabIndex={-1}>
      <p className={styles.summary}>
        {numberWithCommas(total)} freight {total === 1 ? 'load' : 'loads'} found · Showing {numberWithCommas(first)}–{numberWithCommas(last)}
      </p>
      <div className={styles.controls}>
        <Select
          label="Rows per page"
          value={String(pageSize)}
          options={pageSizeOptions}
          onValueChange={(value) => value && onPageSizeChange(Number(value))}
          layout="inline"
          className={styles.pageSize}
        />
        <span className={styles.page} role="status" aria-live="polite" aria-atomic="true">
          Page {page} of {pageCount}
        </span>
        <Button variant="icon" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft size={18} aria-hidden="true" />
        </Button>
        <Button variant="icon" aria-label="Next page" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
          <ChevronRight size={18} aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}

function numberWithCommas(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}
