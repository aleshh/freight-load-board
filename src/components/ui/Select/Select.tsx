import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { useId } from 'react';
import { cn } from '../../../lib/utils';
import fieldStyles from '../shared/FormField.module.css';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value?: string;
  options: SelectOption[];
  onValueChange: (value: string | undefined) => void;
  allLabel?: string;
  disabled?: boolean;
  layout?: 'stacked' | 'inline';
  className?: string;
}

const ALL_VALUE = '__all__';

export function Select({
  label,
  value,
  options,
  onValueChange,
  allLabel = 'All',
  disabled,
  layout = 'stacked',
  className,
}: SelectProps) {
  const labelId = useId();

  return (
    <div className={cn(fieldStyles.field, layout === 'inline' && fieldStyles.inline, className)}>
      <span id={labelId} className={fieldStyles.label}>{label}</span>
      <SelectPrimitive.Root
        value={value ?? ALL_VALUE}
        onValueChange={(next) => onValueChange(next === ALL_VALUE ? undefined : next)}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger className={styles.trigger} aria-labelledby={labelId}>
          <SelectPrimitive.Value />
          <SelectPrimitive.Icon className={styles.icon} aria-hidden="true"><ChevronDown size={16} /></SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={styles.content}
            position="popper"
            sideOffset={4}
            onEscapeKeyDown={(event) => event.stopPropagation()}
          >
            <SelectPrimitive.Viewport>
              <SelectPrimitive.Item className={styles.item} value={ALL_VALUE}>
                <SelectPrimitive.ItemText>{allLabel}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator><Check size={15} /></SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
              {options.map((option) => (
                <SelectPrimitive.Item className={styles.item} value={option.value} key={option.value}>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator><Check size={15} /></SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}
