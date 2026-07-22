import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { useId } from 'react';
import { cn } from '../../lib/utils';
import fieldStyles from './FormField.module.css';
import styles from './AppSelect.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

interface AppSelectProps {
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

export function AppSelect({
  label,
  value,
  options,
  onValueChange,
  allLabel = 'All',
  disabled,
  layout = 'stacked',
  className,
}: AppSelectProps) {
  const labelId = useId();

  return (
    <div className={cn(fieldStyles.field, layout === 'inline' && fieldStyles.inline, className)}>
      <span id={labelId} className={fieldStyles.label}>{label}</span>
      <Select.Root
        value={value ?? ALL_VALUE}
        onValueChange={(next) => onValueChange(next === ALL_VALUE ? undefined : next)}
        disabled={disabled}
      >
        <Select.Trigger className={styles.trigger} aria-labelledby={labelId}>
          <Select.Value />
          <Select.Icon aria-hidden="true"><ChevronDown size={16} /></Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className={styles.content} position="popper" sideOffset={4}>
            <Select.Viewport>
              <Select.Item className={styles.item} value={ALL_VALUE}>
                <Select.ItemText>{allLabel}</Select.ItemText>
                <Select.ItemIndicator><Check size={15} /></Select.ItemIndicator>
              </Select.Item>
              {options.map((option) => (
                <Select.Item className={styles.item} value={option.value} key={option.value}>
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator><Check size={15} /></Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
