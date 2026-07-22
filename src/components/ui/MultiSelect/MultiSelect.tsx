import { Check, ChevronDown, Search, X } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../Button/Button';
import fieldStyles from '../shared/FormField.module.css';
import styles from './MultiSelect.module.css';

export interface MultiSelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface MultiSelectProps<T extends string = string> {
  label: string;
  values?: T[];
  options: MultiSelectOption<T>[];
  onValuesChange: (values: T[] | undefined) => void;
  allLabel?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect<T extends string>({
  label,
  values = [],
  options,
  onValuesChange,
  allLabel = 'All',
  searchable = false,
  disabled,
  className,
}: MultiSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [panelStyle, setPanelStyle] = useState<CSSProperties>();
  const generatedId = useId();
  const labelId = `${generatedId}-label`;
  const summaryId = `${generatedId}-summary`;
  const panelId = `${generatedId}-panel`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const selectedValues = useMemo(() => new Set(values), [values]);
  const filteredOptions = options.filter((option) => option.label.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
  const summary = values.length === 0
    ? allLabel
    : values.length === 1
      ? options.find((option) => option.value === values[0])?.label ?? values[0]
      : `${values.length} selected`;

  const close = (restoreFocus = true) => {
    setOpen(false);
    setSearch('');
    if (restoreFocus) triggerRef.current?.focus();
  };

  useLayoutEffect(() => {
    if (!open) return;

    const positionPanel = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const viewportPadding = 16;
      const gap = 4;
      const width = Math.min(Math.max(rect.width, 272), window.innerWidth - viewportPadding * 2);
      const left = Math.min(
        Math.max(viewportPadding, rect.left),
        window.innerWidth - width - viewportPadding,
      );
      const spaceBelow = window.innerHeight - rect.bottom - viewportPadding - gap;
      const spaceAbove = rect.top - viewportPadding - gap;
      const openAbove = spaceBelow < 360 && spaceAbove > spaceBelow;

      setPanelStyle({
        left,
        width,
        maxHeight: Math.max(180, openAbove ? spaceAbove : spaceBelow),
        ...(openAbove
          ? { bottom: window.innerHeight - rect.top + gap }
          : { top: rect.bottom + gap }),
      });
    };

    positionPanel();
    window.addEventListener('resize', positionPanel);
    window.addEventListener('scroll', positionPanel, true);
    return () => {
      window.removeEventListener('resize', positionPanel);
      window.removeEventListener('scroll', positionPanel, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (searchable) searchRef.current?.focus();
    else optionsRef.current?.querySelector<HTMLInputElement>('input')?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open, searchable]);

  const toggleValue = (value: T, checked: boolean) => {
    const next = checked ? [...values, value] : values.filter((selected) => selected !== value);
    onValuesChange(next.length ? next : undefined);
  };

  return (
    <div ref={rootRef} className={cn(fieldStyles.field, styles.root, className)}>
      <span id={labelId} className={fieldStyles.label}>{label}</span>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-labelledby={labelId}
        aria-describedby={summaryId}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
      >
        <span id={summaryId} className={styles.summary}>{summary}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>

      {open ? (
        <section
          id={panelId}
          className={styles.panel}
          style={panelStyle}
          role="dialog"
          aria-labelledby={labelId}
          onKeyDown={(event) => {
            if (event.key !== 'Escape') return;
            event.preventDefault();
            event.stopPropagation();
            close();
          }}
        >
          <div className={styles.panelHeader}>
            <strong>{label}</strong>
            <Button variant="icon" aria-label={`Close ${label} options`} onClick={() => close()}>
              <X size={17} aria-hidden="true" />
            </Button>
          </div>

          {searchable ? (
            <label className={styles.search}>
              <span className="sr-only">Search {label} options</span>
              <Search size={16} aria-hidden="true" />
              <input
                ref={searchRef}
                type="search"
                value={search}
                placeholder={`Search ${label.toLocaleLowerCase()}…`}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          ) : null}

          <div className={styles.actions}>
            <Button variant="ghost" onClick={() => onValuesChange(options.map((option) => option.value))}>Select all</Button>
            <Button variant="ghost" disabled={values.length === 0} onClick={() => onValuesChange(undefined)}>Clear</Button>
          </div>

          <div ref={optionsRef} className={styles.options} role="group" aria-label={`${label} options`}>
            {filteredOptions.map((option) => (
              <label className={styles.option} key={option.value}>
                <input
                  type="checkbox"
                  checked={selectedValues.has(option.value)}
                  onChange={(event) => toggleValue(option.value, event.target.checked)}
                />
                <span>{option.label}</span>
                <Check className={styles.check} size={16} aria-hidden="true" />
              </label>
            ))}
            {filteredOptions.length === 0 ? <p className={styles.empty}>No matching options.</p> : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
