interface AppSwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export function AppSwitch({ id, checked, onCheckedChange, label, description }: AppSwitchProps) {
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className="app-switch-row">
      <span>
        <span id={`${id}-label`} className="app-switch-row__label">{label}</span>
        {description ? <span id={descriptionId} className="app-switch-row__description">{description}</span> : null}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        className="app-switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={descriptionId}
        onClick={() => onCheckedChange(!checked)}
      >
        <span className="app-switch__thumb" aria-hidden="true" />
      </button>
    </div>
  );
}
