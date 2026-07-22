import type { EquipmentType } from '../../../types/load';
import styles from './EquipmentCell.module.css';

interface EquipmentCellProps {
  type: EquipmentType;
}

export function EquipmentCell({ type }: EquipmentCellProps) {
  return (
    <span className={styles.root}>
      <EquipmentIcon type={type} />
      <span>{type}</span>
    </span>
  );
}

function EquipmentIcon({ type }: EquipmentCellProps) {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {type === 'Dry Van' ? <DryVanIcon /> : null}
      {type === 'Reefer' ? <ReeferIcon /> : null}
      {type === 'Flatbed' ? <FlatbedIcon /> : null}
      {type === 'Step Deck' ? <StepDeckIcon /> : null}
      {type === 'Power Only' ? <PowerOnlyIcon /> : null}
    </svg>
  );
}

function TrailerWheels() {
  return (
    <>
      <circle cx="7" cy="17.5" r="2" />
      <circle cx="17" cy="17.5" r="2" />
    </>
  );
}

function DryVanIcon() {
  return (
    <>
      <rect x="2" y="5" width="18" height="11" rx="1.25" />
      <rect x="20" y="13.5" width="2" height="2.5" rx="0.5" />
      <TrailerWheels />
    </>
  );
}

function ReeferIcon() {
  return (
    <>
      <rect x="2" y="5" width="18" height="11" rx="1.25" />
      <rect x="20" y="13.5" width="2" height="2.5" rx="0.5" />
      <path
        d="M11 7.25v6.5M8.2 8.9l5.6 3.2M8.2 12.1l5.6-3.2"
        fill="none"
        stroke="var(--color-surface)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <TrailerWheels />
    </>
  );
}

function FlatbedIcon() {
  return (
    <>
      <rect x="2" y="12" width="18" height="4" rx="0.75" />
      <rect x="20" y="13.5" width="2" height="2.5" rx="0.5" />
      <TrailerWheels />
    </>
  );
}

function StepDeckIcon() {
  return (
    <>
      <path d="M2 9h7v3.5h11V16H2z" />
      <rect x="20" y="13.5" width="2" height="2.5" rx="0.5" />
      <TrailerWheels />
    </>
  );
}

function PowerOnlyIcon() {
  return (
    <>
      <path d="M3 7h10v4h4.25L21 14.25V16H3z" />
      <circle cx="7" cy="17.5" r="2" />
      <circle cx="17" cy="17.5" r="2" />
    </>
  );
}
