import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppInput } from '../../components/ui/AppInput';

describe('AppInput', () => {
  it('associates its label, error state, and description', () => {
    render(<AppInput label="Maximum price" error="Enter a valid amount" />);
    const input = screen.getByRole('textbox', { name: 'Maximum price' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Enter a valid amount');
  });
});
