import styles from './Switch.module.css';

interface SwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export function Switch({ id, checked, onCheckedChange, label, description }: SwitchProps) {
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className={styles.row}>
      <span className={styles.copy}>
        <span id={`${id}-label`} className={styles.label}>{label}</span>
        {description ? <span id={descriptionId} className={styles.description}>{description}</span> : null}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        className={styles.switch}
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={descriptionId}
        onClick={() => onCheckedChange(!checked)}
      >
        <span className={styles.thumb} aria-hidden="true" />
      </button>
    </div>
  );
}
