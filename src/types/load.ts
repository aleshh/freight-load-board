export const loadStatuses = ['Available', 'Pending', 'Assigned', 'In Transit'] as const;
export type LoadStatus = (typeof loadStatuses)[number];

export const equipmentTypes = ['Dry Van', 'Reefer', 'Flatbed', 'Step Deck', 'Power Only'] as const;
export type EquipmentType = (typeof equipmentTypes)[number];

export interface Load {
  id: string;
  company: string;
  origin: string;
  destination: string;
  weight: number;
  equipmentType: EquipmentType;
  date: string;
  price: number;
  distance: number;
  status: LoadStatus;
}

export function getRatePerMile(load: Pick<Load, 'price' | 'distance'>) {
  return load.distance > 0 ? load.price / load.distance : 0;
}
