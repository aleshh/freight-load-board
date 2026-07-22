import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LocationFilter } from '../../components/load-board/LocationFilter/LocationFilter';

describe('LocationFilter', () => {
  it('clears city selections when switching to state mode', async () => {
    const user = userEvent.setup();

    function Harness() {
      const [cities, setCities] = useState<string[] | undefined>(['Atlanta, GA']);
      const [states, setStates] = useState<string[] | undefined>();
      return (
        <LocationFilter
          label="Origin"
          cityValues={cities}
          stateValues={states}
          cities={['Atlanta, GA', 'Denver, CO']}
          states={['CO', 'GA']}
          onCityValuesChange={setCities}
          onStateValuesChange={setStates}
        />
      );
    }

    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Origin' }));
    expect(screen.getByRole('checkbox', { name: 'Atlanta, GA' })).toBeChecked();

    await user.click(screen.getByRole('button', { name: 'State' }));
    expect(screen.queryByRole('checkbox', { name: 'Atlanta, GA' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: 'GA' }));

    expect(screen.getByRole('button', { name: 'Origin' })).toHaveTextContent('GA');
    expect(screen.getByRole('button', { name: 'State' })).toHaveAttribute('aria-pressed', 'true');
  });
});
