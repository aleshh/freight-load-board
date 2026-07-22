import { Filter, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { AppButton } from '../ui/AppButton';
import { AppInput } from '../ui/AppInput';

interface LoadToolbarProps {
  search?: string;
  onSearchChange: (search?: string) => void;
  filtersOpen: boolean;
  onFiltersOpenChange: (open: boolean) => void;
  activeFilterCount: number;
}

export function LoadToolbar({
  search,
  onSearchChange,
  filtersOpen,
  onFiltersOpenChange,
  activeFilterCount,
}: LoadToolbarProps) {
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
    <div className="load-toolbar">
      <div className="load-toolbar__search">
        <AppInput
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
        <span className="search-shortcut" aria-hidden="true">⌘ K</span>
      </div>
      <AppButton
        variant="secondary"
        aria-label={`Filters${activeFilterCount ? `, ${activeFilterCount} active` : ''}`}
        aria-expanded={filtersOpen}
        aria-controls="load-filters"
        onClick={() => onFiltersOpenChange(!filtersOpen)}
      >
        <Filter size={17} aria-hidden="true" />
        <span className="filter-button__label">Filters{activeFilterCount ? ` (${activeFilterCount})` : ''}</span>
      </AppButton>
    </div>
  );
}
