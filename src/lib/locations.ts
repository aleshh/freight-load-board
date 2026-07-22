export interface ParsedLocation {
  city: string;
  state?: string;
}

export function parseLocation(value: string): ParsedLocation {
  const match = value.match(/^(.*),\s*([A-Z]{2})$/);
  return match ? { city: match[1], state: match[2] } : { city: value };
}
