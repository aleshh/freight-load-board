import { describe, expect, it } from 'vitest';
import { parseLoadQuery, toLoadSearchParams } from '../../hooks/useLoadQueryState';

describe('load query URL state', () => {
  it('parses repeated categorical filter parameters', () => {
    const query = parseLoadQuery(new URLSearchParams(
      'status=Available&status=Pending&equipment=Reefer&company=Alpha+Cargo&company=Beta+Freight&originState=CO',
    ));

    expect(query.filters).toMatchObject({
      status: ['Available', 'Pending'],
      equipmentType: ['Reefer'],
      company: ['Alpha Cargo', 'Beta Freight'],
      originState: ['CO'],
    });
  });

  it('serializes categorical arrays as repeated parameters', () => {
    const params = toLoadSearchParams({
      filters: { status: ['Available', 'Pending'], origin: ['Denver, CO'], destinationState: ['TX'] },
      page: 1,
      pageSize: 25,
    });

    expect(params.getAll('status')).toEqual(['Available', 'Pending']);
    expect(params.getAll('origin')).toEqual(['Denver, CO']);
    expect(params.getAll('destinationState')).toEqual(['TX']);
  });

  it('prefers state mode when a URL contains conflicting city and state filters', () => {
    const query = parseLoadQuery(new URLSearchParams('origin=Atlanta%2C+GA&originState=CO'));

    expect(query.filters?.origin).toBeUndefined();
    expect(query.filters?.originState).toEqual(['CO']);
  });
});
