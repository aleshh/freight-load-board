import { describe, expect, it } from 'vitest';
import { parseLoadQuery, toLoadSearchParams } from '../../hooks/useLoadQueryState';

describe('load query URL state', () => {
  it('parses repeated categorical filter parameters', () => {
    const query = parseLoadQuery(new URLSearchParams(
      'status=Available&status=Pending&equipment=Reefer&company=Alpha+Cargo&company=Beta+Freight',
    ));

    expect(query.filters).toMatchObject({
      status: ['Available', 'Pending'],
      equipmentType: ['Reefer'],
      company: ['Alpha Cargo', 'Beta Freight'],
    });
  });

  it('serializes categorical arrays as repeated parameters', () => {
    const params = toLoadSearchParams({
      filters: { status: ['Available', 'Pending'], origin: ['Denver, CO'] },
      page: 1,
      pageSize: 25,
    });

    expect(params.getAll('status')).toEqual(['Available', 'Pending']);
    expect(params.getAll('origin')).toEqual(['Denver, CO']);
  });
});
