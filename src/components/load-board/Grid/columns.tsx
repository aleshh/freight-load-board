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
  { field: 'id', headerName: 'Load ID', minWidth: 120, pinned: 'left' },
  { field: 'company', headerName: 'Company', minWidth: 180 },
  { field: 'origin', headerName: 'Origin', minWidth: 155 },
  { field: 'destination', headerName: 'Destination', minWidth: 155 },
  {
    field: 'weight',
    headerName: 'Weight',
    minWidth: 125,
    type: 'numericColumn',
    valueFormatter: ({ value }) => `${numberFormatter.format(value)} lb`,
  },
  { field: 'equipmentType', headerName: 'Equipment', minWidth: 135 },
  {
    field: 'date',
    headerName: 'Pickup date',
    minWidth: 145,
    valueFormatter: ({ value }) => formatDate(value),
  },
  {
    field: 'price',
    headerName: 'Price',
    minWidth: 115,
    type: 'numericColumn',
    valueFormatter: ({ value }) => currencyFormatter.format(value),
  },
  {
    field: 'distance',
    headerName: 'Distance',
    minWidth: 125,
    type: 'numericColumn',
    valueFormatter: ({ value }) => `${numberFormatter.format(value)} mi`,
  },
  {
    colId: 'ratePerMile',
    headerName: 'Rate / mi',
    minWidth: 120,
    type: 'numericColumn',
    valueGetter: ({ data }) => (data ? getRatePerMile(data) : 0),
    valueFormatter: ({ value }) => decimalCurrencyFormatter.format(value),
  },
  {
    field: 'status',
    headerName: 'Status',
    minWidth: 130,
    cellRenderer: ({ value }: { value: LoadStatus }) => <Badge tone={statusTones[value]}>{value}</Badge>,
  },
];
