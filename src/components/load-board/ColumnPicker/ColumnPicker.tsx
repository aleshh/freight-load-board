import { Columns3, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../ui/Button/Button';
import type { GridColumnState } from '../Grid/Grid';
import styles from './ColumnPicker.module.css';

interface ColumnPickerProps {
  columns: GridColumnState[];
  onVisibilityChange: (id: string, visible: boolean) => void;
  onPinnedChange: (id: string, pinned: boolean) => void;
  onReset: () => void;
}

export function ColumnPicker({ columns, onVisibilityChange, onPinnedChange, onReset }: ColumnPickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const visibleCount = columns.filter((column) => column.visible).length;

  const close = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    controlsRef.current?.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className={styles.root}>
      <Button
        ref={triggerRef}
        variant="secondary"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="column-picker"
        disabled={columns.length === 0}
        onClick={() => setOpen((current) => !current)}
      >
        <Columns3 size={17} aria-hidden="true" />
        <span className={styles.triggerLabel}>Columns</span>
      </Button>

      {open ? (
        <section
          id="column-picker"
          className={styles.panel}
          role="dialog"
          aria-labelledby="column-picker-heading"
          onKeyDown={(event) => {
            if (event.key !== 'Escape') return;
            event.preventDefault();
            event.stopPropagation();
            close();
          }}
        >
          <div className={styles.heading}>
            <div>
              <h2 id="column-picker-heading">Columns</h2>
              <p>Choose visible and pinned columns.</p>
            </div>
            <Button variant="icon" aria-label="Close column picker" onClick={() => close()}>
              <X size={18} aria-hidden="true" />
            </Button>
          </div>

          <div className={styles.columnHeadings} aria-hidden="true">
            <span>Column</span>
            <span>Show</span>
            <span>Pin</span>
          </div>
          <div ref={controlsRef} className={styles.columnList}>
            {columns.map((column) => (
              <div className={styles.columnRow} key={column.id}>
                <span className={styles.columnName}>{column.label}</span>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={column.visible}
                    disabled={column.visible && visibleCount === 1}
                    onChange={(event) => onVisibilityChange(column.id, event.target.checked)}
                  />
                  <span className="sr-only">Show {column.label}</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={column.pinned}
                    disabled={!column.visible}
                    onChange={(event) => onPinnedChange(column.id, event.target.checked)}
                  />
                  <span className="sr-only">Pin {column.label}</span>
                </label>
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <span>At least one column must remain visible.</span>
            <Button variant="ghost" onClick={onReset}>Reset columns</Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
