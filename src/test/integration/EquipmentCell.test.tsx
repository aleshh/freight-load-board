import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EquipmentCell } from '../../components/load-board/EquipmentCell/EquipmentCell';
import { equipmentTypes } from '../../types/load';

describe('EquipmentCell', () => {
  it.each(equipmentTypes)('renders a decorative symbol alongside the %s label', (type) => {
    const { container } = render(<EquipmentCell type={type} />);

    expect(screen.getByText(type)).toBeVisible();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
