import type { ColDef } from 'ag-grid-community';
import { Badge, type BadgeTone } from '../../ui/Badge/Badge';
import { currencyFormatter, decimalCurrencyFormatter, formatDate, numberFormatter } from '../../../lib/formatters';
import { getRatePerMile, type Load, type LoadStatus } from '../../../types/load';

const statusTones: Record<LoadStatus, BadgeTone> = {
  Available: 'success',
  Pending: 'warning',
  Assigned: 'brand',
  'In Transit': 'neutral',
};

export const loadColumnDefinitions: ColDef<Load>[] = [
  { field: 'id', headerName: 'Load ID', width: 120, minWidth: 110, pinned: 'left' },
  { field: 'company', headerName: 'Company', flex: 1.35, minWidth: 165 },
  { field: 'origin', headerName: 'Origin', flex: 1.2, minWidth: 145 },
  { field: 'destination', headerName: 'Destination', flex: 1.25, minWidth: 150 },
  {
    field: 'weight',
    headerName: 'Weight',
    flex: 0.9,
    minWidth: 120,
    type: 'numericColumn',
    valueFormatter: ({ value }) => `${numberFormatter.format(value)} lb`,
  },
  { field: 'equipmentType', headerName: 'Equipment', flex: 1, minWidth: 125 },
  {
    field: 'date',
    headerName: 'Pickup date',
    flex: 1.1,
    minWidth: 135,
    valueFormatter: ({ value }) => formatDate(value),
  },
  {
    field: 'price',
    headerName: 'Price',
    flex: 0.8,
    minWidth: 105,
    type: 'numericColumn',
    valueFormatter: ({ value }) => currencyFormatter.format(value),
  },
  {
    field: 'distance',
    headerName: 'Distance',
    flex: 0.85,
    minWidth: 115,
    type: 'numericColumn',
    valueFormatter: ({ value }) => `${numberFormatter.format(value)} mi`,
  },
  {
    colId: 'ratePerMile',
    headerName: 'Rate / mi',
    flex: 0.85,
    minWidth: 110,
    type: 'numericColumn',
    valueGetter: ({ data }) => (data ? getRatePerMile(data) : 0),
    valueFormatter: ({ value }) => decimalCurrencyFormatter.format(value),
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.9,
    minWidth: 120,
    cellRenderer: ({ value }: { value: LoadStatus }) => <Badge tone={statusTones[value]}>{value}</Badge>,
  },
];
