import { Filter, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { ColumnPicker } from '../ColumnPicker/ColumnPicker';
import type { GridColumnState } from '../Grid/Grid';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  search?: string;
  onSearchChange: (search?: string) => void;
  filtersOpen: boolean;
  onFiltersOpenChange: (open: boolean) => void;
  activeFilterCount: number;
  columns: GridColumnState[];
  onColumnVisibilityChange: (id: string, visible: boolean) => void;
  onColumnPinnedChange: (id: string, pinned: boolean) => void;
  onResetColumns: () => void;
}

export function Toolbar({
  search,
  onSearchChange,
  filtersOpen,
  onFiltersOpenChange,
  activeFilterCount,
  columns,
  onColumnVisibilityChange,
  onColumnPinnedChange,
  onResetColumns,
}: ToolbarProps) {
  const [inputValue, setInputValue] = useState(search ?? '');
  const debouncedSearch = useDebouncedValue(inputValue, 300);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => setInputValue(search ?? ''), [search]);
  useEffect(() => onSearchChange(debouncedSearch || undefined), [debouncedSearch, onSearchChange]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.search}>
        <Input
          ref={searchRef}
          label="Search loads"
          hideLabel
          type="search"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Search ID, company, city, equipment, or status"
          leadingIcon={<Search size={18} />}
          aria-keyshortcuts="Control+K Meta+K"
        />
        <span className={styles.shortcut} aria-hidden="true">⌘ K</span>
      </div>
      <Button
        id="load-filters-trigger"
        variant="secondary"
        aria-label={`Filters${activeFilterCount ? `, ${activeFilterCount} active` : ''}`}
        aria-expanded={filtersOpen}
        aria-controls="load-filters"
        onClick={() => onFiltersOpenChange(!filtersOpen)}
      >
        <Filter size={17} aria-hidden="true" />
        <span className={styles.filterLabel}>Filters{activeFilterCount ? ` (${activeFilterCount})` : ''}</span>
      </Button>
      <ColumnPicker
        columns={columns}
        onVisibilityChange={onColumnVisibilityChange}
        onPinnedChange={onColumnPinnedChange}
        onReset={onResetColumns}
      />
    </div>
  );
}
