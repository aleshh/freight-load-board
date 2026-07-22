import { readFile, writeFile } from 'node:fs/promises';

const sourceUrl = new URL('../src/data/mockLoads.json', import.meta.url);
const outputUrl = new URL('../src/data/mockLoads.large.json', import.meta.url);
const seedLoads = JSON.parse(await readFile(sourceUrl, 'utf8'));

const companies = [
  'Northstar Freight', 'Blue River Logistics', 'Summit Carriers', 'Prairie Line Transport',
  'Evergreen Shipping', 'Iron Horse Freight', 'Atlas Cargo Co.', 'Redwood Transit',
  'Continental Haulage', 'Pioneer Logistics', 'Great Basin Freight', 'Lakeside Carriers',
];
const cities = [
  'Denver, CO', 'Dallas, TX', 'Chicago, IL', 'Atlanta, GA', 'Phoenix, AZ', 'Los Angeles, CA',
  'Omaha, NE', 'Kansas City, MO', 'Seattle, WA', 'Portland, OR', 'Houston, TX', 'New Orleans, LA',
  'Salt Lake City, UT', 'Boise, ID', 'Memphis, TN', 'Charlotte, NC', 'Las Vegas, NV',
  'St. Louis, MO', 'Sacramento, CA', 'Jacksonville, FL', 'Spokane, WA', 'Minneapolis, MN',
  'Albuquerque, NM', 'Nashville, TN',
];
const equipment = ['Dry Van', 'Reefer', 'Flatbed', 'Step Deck', 'Power Only'];
const statuses = ['Available', 'Pending', 'Assigned', 'In Transit'];
const startDate = Date.UTC(2026, 6, 21);

const loads = [...seedLoads];
for (let index = seedLoads.length; index < 10_000; index += 1) {
  const originIndex = (index * 7 + 3) % cities.length;
  let destinationIndex = (index * 11 + 9) % cities.length;
  if (destinationIndex === originIndex) destinationIndex = (destinationIndex + 5) % cities.length;
  const distance = 120 + ((index * 83) % 1_780);
  const rate = 2.15 + ((index * 17) % 390) / 100;
  const date = new Date(startDate + (index % 75) * 86_400_000).toISOString().slice(0, 10);

  loads.push({
    id: `LD-${10_401 + index}`,
    company: companies[index % companies.length],
    origin: cities[originIndex],
    destination: cities[destinationIndex],
    weight: 8_000 + ((index * 1_337) % 40_001),
    equipmentType: equipment[index % equipment.length],
    date,
    price: Math.round(distance * rate / 10) * 10,
    distance,
    status: statuses[index % statuses.length],
  });
}

await writeFile(outputUrl, `${JSON.stringify(loads)}\n`);
console.log(`Generated ${loads.length.toLocaleString()} records at ${outputUrl.pathname}`);
