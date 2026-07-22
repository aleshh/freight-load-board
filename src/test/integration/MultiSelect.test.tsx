import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MultiSelect } from '../../components/ui/MultiSelect/MultiSelect';

const options = [
  { value: 'Available', label: 'Available' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Assigned', label: 'Assigned' },
];

describe('MultiSelect', () => {
  it('selects multiple values and summarizes the result', async () => {
    const user = userEvent.setup();

    function Harness() {
      const [values, setValues] = useState<string[]>();
      return <MultiSelect label="Status" values={values} options={options} onValuesChange={setValues} allLabel="All statuses" />;
    }

    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Status' });
    await user.click(trigger);
    await user.click(screen.getByRole('checkbox', { name: 'Available' }));
    await user.click(screen.getByRole('checkbox', { name: 'Pending' }));
    expect(trigger).toHaveTextContent('2 selected');

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Status' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
