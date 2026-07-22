import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from '../../components/ui/Input/Input';

describe('Input', () => {
  it('associates its label, error state, and description', () => {
    render(<Input label="Maximum price" error="Enter a valid amount" />);
    const input = screen.getByRole('textbox', { name: 'Maximum price' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Enter a valid amount');
  });
});
