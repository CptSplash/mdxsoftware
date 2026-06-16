export type QuoteSystemId = 'traditional' | 'amj' | 'gsmod'

export interface ProjectInputs {
  projectName: string
  location: string
  dwellingAreaM2: number
  buildAreaM2: number
  totalCostingAreaM2: number
  carportAreaM2: number
  alfrescoPorchAreaM2: number
  wetAreaM2: number
  externalWallM2: number
  internalDryWallM2: number
  wetWallTileM2: number
  roofAreaM2: number
  ceilingAreaM2: number
  windowAreaM2: number
  internalDoorCount: number
  bathroomCount: number
  kitchenCabinetM: number
  laundryCabinetM: number
  containerCount: number
  moduleCount: number
  exchangeRateRmbToAud: number
}

export type ProjectQuantityKey = {
  [Key in keyof ProjectInputs]: ProjectInputs[Key] extends number ? Key : never
}[keyof ProjectInputs]

export interface QuoteLine {
  id: string
  category: string
  item: string
  driver: ProjectQuantityKey | 'fixed'
  quantity: number
  unit: string
  rate: number
  currency: 'RMB' | 'AUD'
  confidence: 'extracted' | 'derived' | 'manual'
  note?: string
}

export const perth200Inputs: ProjectInputs = {
  projectName: 'Perth200',
  location: 'Perth, WA',
  dwellingAreaM2: 147,
  buildAreaM2: 164,
  totalCostingAreaM2: 200,
  carportAreaM2: 31,
  alfrescoPorchAreaM2: 17,
  wetAreaM2: 18,
  externalWallM2: 201,
  internalDryWallM2: 387,
  wetWallTileM2: 84,
  roofAreaM2: 280,
  ceilingAreaM2: 200,
  windowAreaM2: 35,
  internalDoorCount: 6,
  bathroomCount: 2,
  kitchenCabinetM: 4.2,
  laundryCabinetM: 2.4,
  containerCount: 2,
  moduleCount: 6,
  exchangeRateRmbToAud: 0.21,
}

export const traditionalRawlinsonsLines: QuoteLine[] = [
  {
    id: 'rawlinsons-low',
    category: 'Rawlinsons 2024 reference',
    item: 'Perth residential benchmark - lower bound',
    driver: 'totalCostingAreaM2',
    quantity: perth200Inputs.totalCostingAreaM2,
    unit: 'm2',
    rate: 3650,
    currency: 'AUD',
    confidence: 'manual',
    note: 'From local Rawlinsons reference page. Keep editable until project class is confirmed.',
  },
  {
    id: 'rawlinsons-high',
    category: 'Rawlinsons 2024 reference',
    item: 'Perth residential benchmark - upper bound',
    driver: 'totalCostingAreaM2',
    quantity: perth200Inputs.totalCostingAreaM2,
    unit: 'm2',
    rate: 3935,
    currency: 'AUD',
    confidence: 'manual',
    note: 'Classical build costing is intentionally a reference band, not a finished QS quote.',
  },
]

export const amjLines: QuoteLine[] = [
  { id: 'amj-butyl-foundation', category: 'Foundation and flooring', item: 'Butyl sealer tape to slab interface', driver: 'fixed', quantity: 109, unit: 'm', rate: 13, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-dry-floor', category: 'Foundation and flooring', item: 'Dry area SPC floor board', driver: 'dwellingAreaM2', quantity: 147, unit: 'm2', rate: 78, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-wet-floor', category: 'Foundation and flooring', item: 'Wet area ceramic floor tile', driver: 'wetAreaM2', quantity: 18, unit: 'm2', rate: 75, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-lfs-frame', category: 'Light steel structure', item: 'Light steel keel framework', driver: 'totalCostingAreaM2', quantity: 200, unit: 'm2', rate: 380, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-fasteners', category: 'Light steel structure', item: 'Structural fasteners', driver: 'totalCostingAreaM2', quantity: 200, unit: 'm2', rate: 50, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-hebel', category: 'External wall system', item: '75mm Hebel external wall cladding', driver: 'externalWallM2', quantity: 201, unit: 'm2', rate: 120, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-hebel-screws', category: 'External wall system', item: 'External cladding fixing screws', driver: 'fixed', quantity: 6030, unit: 'pcs', rate: 2, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-top-hat-wall', category: 'External wall system', item: 'Wall furring channel', driver: 'externalWallM2', quantity: 201, unit: 'm2', rate: 22, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-vapour', category: 'External wall system', item: 'Vapour barrier / reflective insulation', driver: 'fixed', quantity: 241.2, unit: 'm2', rate: 15, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-wall-insulation-ext', category: 'External wall system', item: 'External wall glasswool', driver: 'externalWallM2', quantity: 201, unit: 'm2', rate: 17, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-drywall', category: 'Internal wall system', item: 'Internal dry wall gypsum board', driver: 'internalDryWallM2', quantity: 387, unit: 'm2', rate: 33, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-drywall-screws', category: 'Internal wall system', item: 'Dry wall fixing screws', driver: 'fixed', quantity: 11610, unit: 'pcs', rate: 2, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-wetwall-board', category: 'Internal wall system', item: 'Wet area fibre cement base board', driver: 'wetWallTileM2', quantity: 84, unit: 'm2', rate: 33, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-wetwall-screws', category: 'Internal wall system', item: 'Wet wall board fixing screws', driver: 'fixed', quantity: 2520, unit: 'pcs', rate: 2, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-wall-tiles', category: 'Internal wall system', item: 'Bathroom and kitchen wall tiles', driver: 'wetWallTileM2', quantity: 84, unit: 'm2', rate: 75, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-tile-adhesive', category: 'Internal wall system', item: 'Tile adhesive', driver: 'wetWallTileM2', quantity: 84, unit: 'm2', rate: 30, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-wall-insulation-int', category: 'Internal wall system', item: 'Internal wall glasswool', driver: 'fixed', quantity: 471, unit: 'm2', rate: 17, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-skirting', category: 'Internal wall system', item: 'PVC skirting', driver: 'fixed', quantity: 160, unit: 'm', rate: 17, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-cornice', category: 'Internal wall system', item: 'Gypsum lining / cornice', driver: 'fixed', quantity: 160, unit: 'm', rate: 16, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-jointing', category: 'Internal wall system', item: 'Joint mix, tape, waterproofing compound', driver: 'fixed', quantity: 672, unit: 'm2', rate: 21, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-roof-film', category: 'Roof system', item: 'EPE thermal insulation film', driver: 'roofAreaM2', quantity: 280, unit: 'm2', rate: 28, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-roof-purlin', category: 'Roof system', item: 'Roof purlin', driver: 'roofAreaM2', quantity: 280, unit: 'm2', rate: 28, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-colorbond', category: 'Roof system', item: 'Colorbond metal roof sheets', driver: 'roofAreaM2', quantity: 280, unit: 'm2', rate: 78, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-gutters', category: 'Roof system', item: 'Aluminium gutter and downpipe system', driver: 'fixed', quantity: 70, unit: 'm', rate: 95, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-dry-ceiling', category: 'Ceiling system', item: 'Dry room gypsum ceiling', driver: 'fixed', quantity: 180, unit: 'm2', rate: 29, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-wet-ceiling', category: 'Ceiling system', item: 'Wet room waterproof gypsum ceiling', driver: 'fixed', quantity: 20, unit: 'm2', rate: 29, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-ceiling-insulation', category: 'Ceiling system', item: 'R4.5 ceiling glasswool', driver: 'ceilingAreaM2', quantity: 200, unit: 'm2', rate: 35, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-ceiling-purlin', category: 'Ceiling system', item: 'Ceiling purlin channel', driver: 'ceilingAreaM2', quantity: 200, unit: 'm2', rate: 22, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-entry-door', category: 'Doors and windows', item: 'Entry door', driver: 'fixed', quantity: 1, unit: 'set', rate: 4800, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-internal-doors', category: 'Doors and windows', item: 'Internal doors', driver: 'internalDoorCount', quantity: 5, unit: 'set', rate: 1350, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-sliding-door', category: 'Doors and windows', item: 'Internal sliding door', driver: 'fixed', quantity: 1, unit: 'set', rate: 4650, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-windows', category: 'Doors and windows', item: 'Aluminium windows and external glazed units', driver: 'windowAreaM2', quantity: 35, unit: 'm2', rate: 1450, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-window-tape', category: 'Doors and windows', item: 'Window butyl sealer tape', driver: 'fixed', quantity: 80, unit: 'm', rate: 25, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-processing-fittings', category: 'Processing', item: 'Fittings, rivets, screws, sealant', driver: 'totalCostingAreaM2', quantity: 200, unit: 'm2', rate: 46, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-processing-trims', category: 'Processing', item: 'Openings, sills and corner trims', driver: 'totalCostingAreaM2', quantity: 200, unit: 'm2', rate: 26, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-assembly-trusses', category: 'Assembly', item: 'Wall/truss assembly cost', driver: 'totalCostingAreaM2', quantity: 200, unit: 'm2', rate: 150, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-assembly-board', category: 'Assembly', item: 'Wall board assembly', driver: 'fixed', quantity: 672, unit: 'm2', rate: 60, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-toilets', category: 'Sanitary and cabinets', item: 'Toilets', driver: 'bathroomCount', quantity: 2, unit: 'pcs', rate: 770, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-shower-panels', category: 'Sanitary and cabinets', item: 'Shower panels and doors', driver: 'bathroomCount', quantity: 2, unit: 'pcs', rate: 2200, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-vanities', category: 'Sanitary and cabinets', item: 'Bathroom vanities', driver: 'bathroomCount', quantity: 2, unit: 'pcs', rate: 1860, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-laundry', category: 'Sanitary and cabinets', item: 'Laundry cabinet', driver: 'laundryCabinetM', quantity: 2.4, unit: 'm', rate: 980, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-kitchen', category: 'Sanitary and cabinets', item: 'Kitchen cabinet and island', driver: 'kitchenCabinetM', quantity: 4.2, unit: 'm', rate: 2050, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-fob', category: 'Logistics', item: 'FOB Guangzhou inland transport', driver: 'containerCount', quantity: 2, unit: 'item', rate: 5000, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-ocean', category: 'Logistics', item: 'Ocean freight - CIF', driver: 'containerCount', quantity: 2, unit: 'item', rate: 15000, currency: 'RMB', confidence: 'extracted' },
  { id: 'amj-loading', category: 'Logistics', item: 'Container loading fee', driver: 'containerCount', quantity: 2, unit: 'container', rate: 1200, currency: 'RMB', confidence: 'extracted' },
]

export const gsmodSeedLines: QuoteLine[] = [
  { id: 'gsmod-factory', category: 'Factory modules', item: 'Container/pod module manufacture', driver: 'totalCostingAreaM2', quantity: 200, unit: 'm2', rate: 2600, currency: 'RMB', confidence: 'manual', note: 'Placeholder seed: GSMOD quote PDF has no usable text layer in this environment.' },
  { id: 'gsmod-fitout', category: 'Factory modules', item: 'Factory fitout allowance', driver: 'bathroomCount', quantity: 2, unit: 'wet room', rate: 18000, currency: 'RMB', confidence: 'manual' },
  { id: 'gsmod-freight', category: 'Logistics', item: 'Freight and container movement', driver: 'containerCount', quantity: 2, unit: 'container', rate: 22000, currency: 'RMB', confidence: 'manual' },
  { id: 'gsmod-install', category: 'Installation', item: 'Crane, set-down and site joining allowance', driver: 'moduleCount', quantity: 6, unit: 'module', rate: 4500, currency: 'RMB', confidence: 'manual' },
  { id: 'gsmod-local', category: 'Local works', item: 'Local services, footings and exclusions allowance', driver: 'totalCostingAreaM2', quantity: 200, unit: 'm2', rate: 420, currency: 'RMB', confidence: 'manual' },
]

export function lineAmount(line: QuoteLine, inputs: ProjectInputs) {
  const quantity = line.driver === 'fixed' ? line.quantity : inputs[line.driver]
  return quantity * line.rate
}

export function rmbToAud(amount: number, inputs: ProjectInputs) {
  return amount * inputs.exchangeRateRmbToAud
}
