import type { Project, Client, Tradie, WorkOrder, PaymentClaim, PrelimLine, DiaryEntry } from './types'

export const clients: Client[] = [
  {
    id: 'client-1',
    name: 'Landmark Homes Pty Ltd',
    abn: '51 824 753 556',
    contactPerson: 'James Whitfield',
    phone: '02 9881 4400',
    email: 'j.whitfield@landmarkhomes.com.au',
    address: '12 Norwest Boulevard, Bella Vista NSW 2153',
    clientType: 'Developer',
    notes: 'Preferred developer client. Payment always on time. Long-term relationship since 2019.',
  },
  {
    id: 'client-2',
    name: 'Cooper Street Commercial Pty Ltd',
    abn: '37 612 984 201',
    contactPerson: 'Priya Mehta',
    phone: '02 9319 7722',
    email: 'priya@cooperstcom.com.au',
    address: 'Level 4, 55 Cooper St, Surry Hills NSW 2010',
    clientType: 'Commercial',
    notes: 'Office fitout specialist. Strict programme adherence required.',
  },
  {
    id: 'client-3',
    name: 'SA Housing Trust',
    abn: '18 463 829 100',
    contactPerson: 'Greg Paterson',
    phone: '08 8463 1200',
    email: 'g.paterson@sahousingtrust.sa.gov.au',
    address: '91 Grenfell St, Adelaide SA 5000',
    clientType: 'Council',
    notes: 'Government client. Tender pricing critical. Retainage held for 12 months.',
  },
]

export const projects: Project[] = [
  {
    id: 'proj-1',
    projectNumber: 'PRJ-2026-001',
    name: 'Kellyville Bathroom Pods',
    type: 'Pod/Modular',
    status: 'Active',
    contractValue: 185000000,
    contractType: 'Lump Sum',
    startDate: '2026-01-15',
    endDate: '2026-09-30',
    siteAddress: 'Lot 42-45 Swift Parrot Close, Kellyville NSW 2155',
    percentComplete: 65,
    clientId: 'client-1',
    notes: 'Manufacture and install 48 modular bathroom pods for Landmark Homes estate. Steel-framed, tiled, fully plumbed.',
    accentColor: '#1E3A5F',
  },
  {
    id: 'proj-2',
    projectNumber: 'PRJ-2026-002',
    name: 'Surry Hills Commercial Fitout',
    type: 'Fit-out',
    status: 'Active',
    contractValue: 42000000,
    contractType: 'Cost-Plus',
    startDate: '2026-03-10',
    endDate: '2026-07-31',
    siteAddress: 'Level 4, 55 Cooper St, Surry Hills NSW 2010',
    percentComplete: 30,
    clientId: 'client-2',
    notes: 'Full commercial fitout of 1,200sqm office space. Open plan, 4 meeting rooms, kitchen, amenities.',
    accentColor: '#0EA5E9',
  },
  {
    id: 'proj-3',
    projectNumber: 'PRJ-2026-003',
    name: 'Allenby Gardens Townhouses',
    type: 'Residential',
    status: 'Tender',
    contractValue: 210000000,
    contractType: 'Lump Sum',
    startDate: '2026-09-01',
    endDate: '2027-12-31',
    siteAddress: '18 Charles St, Allenby Gardens SA 5009',
    percentComplete: 0,
    clientId: 'client-3',
    notes: 'Tender for 12 x 2-storey townhouses. Brick veneer, double garage. VCAT-approved DA.',
    accentColor: '#10B981',
  },
]

export const tradies: Tradie[] = [
  {
    id: 'tradie-1',
    businessName: 'Volt Force Electrical',
    tradeType: 'Electrician',
    contactName: 'Steve Nguyen',
    phone: '0411 882 334',
    email: 'steve@voltforce.com.au',
    abn: '74 381 920 445',
    licenceNumber: 'EC012834',
    licenceExpiry: '2026-07-20', // ~34 days — amber warning
    insuranceExpiry: '2026-12-15',
    rating: 4,
    notes: 'Excellent workmanship. Licence renewal pending — follow up end of June.',
    states: ['NSW'],
    status: 'Busy',
  },
  {
    id: 'tradie-2',
    businessName: 'BlueLine Plumbing Solutions',
    tradeType: 'Plumber',
    contactName: 'Marco Di Palma',
    phone: '0422 915 600',
    email: 'marco@bluelineplumbing.com.au',
    abn: '55 719 302 884',
    licenceNumber: 'PL038821',
    licenceExpiry: '2027-03-01',
    insuranceExpiry: '2026-11-30',
    rating: 5,
    notes: 'Best plumber on books. Always on time, great communication.',
    states: ['NSW', 'ACT'],
    status: 'Available',
  },
  {
    id: 'tradie-3',
    businessName: 'RockSolid Concrete',
    tradeType: 'Concretor',
    contactName: 'Dave Kouris',
    phone: '0437 551 209',
    email: 'd.kouris@rocksolidconcrete.com.au',
    abn: '29 504 671 338',
    licenceNumber: 'BC022991',
    licenceExpiry: '2027-06-10',
    insuranceExpiry: '2026-09-01',
    rating: 4,
    notes: 'Specialist in elevated slabs and basement work.',
    states: ['NSW', 'VIC'],
    status: 'Available',
  },
  {
    id: 'tradie-4',
    businessName: 'Apex Framing & Carpentry',
    tradeType: 'Framer',
    contactName: 'Tom Callaghan',
    phone: '0405 774 120',
    email: 'tom@apexframing.com.au',
    abn: '61 238 540 772',
    licenceNumber: 'BC019044',
    licenceExpiry: '2026-11-22',
    insuranceExpiry: '2026-08-01',
    rating: 5,
    notes: 'Expert in modular and pod framing systems.',
    states: ['NSW'],
    status: 'Busy',
  },
  {
    id: 'tradie-5',
    businessName: 'Precision Tiling Co',
    tradeType: 'Tiler',
    contactName: 'Yusuf Al-Rashid',
    phone: '0452 338 891',
    email: 'yusuf@precisiontiling.com.au',
    abn: '83 617 204 559',
    licenceNumber: undefined,
    licenceExpiry: undefined,
    insuranceExpiry: '2026-10-20',
    rating: 4,
    notes: 'Large format tile specialist. Slow on grouting but immaculate finish.',
    states: ['NSW', 'QLD'],
    status: 'Available',
  },
  {
    id: 'tradie-6',
    businessName: 'Coastal Colour Painting',
    tradeType: 'Painter',
    contactName: 'Rachel Stanton',
    phone: '0488 210 045',
    email: 'rachel@coastalcolour.com.au',
    abn: '47 902 834 610',
    licenceNumber: 'PT008833',
    licenceExpiry: '2027-02-14',
    insuranceExpiry: '2026-07-28',
    rating: 3,
    notes: 'Good on interiors. Insurance due for renewal — check before next project allocation.',
    states: ['NSW', 'VIC', 'SA'],
    status: 'Available',
  },
]

export const workOrders: WorkOrder[] = [
  // PRJ-2026-001 Kellyville Bathroom Pods
  {
    id: 'wo-1',
    projectId: 'proj-1',
    tradieId: 'tradie-2',
    scope: 'Supply and install all plumbing rough-in for 48 bathroom pods including waste, hot and cold water services to AS3500.',
    quotedPrice: 38400000,
    startDate: '2026-02-10',
    duration: 28,
    status: 'Complete',
    notes: 'Completed ahead of schedule. Retention to be released at PC.',
  },
  {
    id: 'wo-2',
    projectId: 'proj-1',
    tradieId: 'tradie-1',
    scope: 'Install electrical fitout to all 48 pods including GPOs, lighting, exhaust fans, heat lamps and switchboards.',
    quotedPrice: 28800000,
    startDate: '2026-03-15',
    duration: 21,
    status: 'On Site',
    notes: 'Progress at 70%. Minor RFI raised on exhaust fan spec.',
  },
  {
    id: 'wo-3',
    projectId: 'proj-1',
    tradieId: 'tradie-5',
    scope: 'Supply and lay wall and floor tiles to all 48 pods. Large format 600x600 floor, 300x600 wall tiles.',
    quotedPrice: 22000000,
    startDate: '2026-04-20',
    duration: 30,
    status: 'On Site',
    notes: 'Currently laying floor tiles to batch 2. Grouting commences week 3.',
  },
  {
    id: 'wo-4',
    projectId: 'proj-1',
    tradieId: 'tradie-4',
    scope: 'Structural framing for all 48 steel-framed pod modules to engineering drawings.',
    quotedPrice: 44000000,
    startDate: '2026-01-20',
    duration: 18,
    status: 'Complete',
    notes: 'All frames signed off by structural engineer.',
  },
  // PRJ-2026-002 Surry Hills Commercial Fitout
  {
    id: 'wo-5',
    projectId: 'proj-2',
    tradieId: 'tradie-1',
    scope: 'Full electrical fitout — power, data conduit, lighting, emergency systems to NCC BCA commercial requirements.',
    quotedPrice: 11200000,
    startDate: '2026-04-01',
    duration: 35,
    status: 'Accepted',
    notes: 'Awaiting access — current tenant vacating 28 March.',
  },
  {
    id: 'wo-6',
    projectId: 'proj-2',
    tradieId: 'tradie-2',
    scope: 'Plumbing fitout — kitchen, amenities, floor waste, HWS, backflow prevention.',
    quotedPrice: 5400000,
    startDate: '2026-04-08',
    duration: 20,
    status: 'Quoted',
    notes: 'Quote received, reviewing scope variation for extra toilet block.',
  },
  {
    id: 'wo-7',
    projectId: 'proj-2',
    tradieId: 'tradie-6',
    scope: 'Interior painting — all walls, ceilings, doors and frames. Dulux premium finish throughout.',
    quotedPrice: 3800000,
    startDate: '2026-06-15',
    duration: 14,
    status: 'Invited',
    notes: 'Invitation sent 10 June. Awaiting quote.',
  },
]

export const paymentClaims: PaymentClaim[] = [
  {
    id: 'claim-1',
    projectId: 'proj-1',
    claimNumber: 1,
    claimDate: '2026-02-28',
    claimPeriod: 'February 2026',
    amount: 46250000,
    retentionPct: 5,
    status: 'Paid',
    dueDate: '2026-03-28',
  },
  {
    id: 'claim-2',
    projectId: 'proj-1',
    claimNumber: 2,
    claimDate: '2026-03-31',
    claimPeriod: 'March 2026',
    amount: 55500000,
    retentionPct: 5,
    status: 'Claimed',
    dueDate: '2026-06-20',
  },
  {
    id: 'claim-3',
    projectId: 'proj-2',
    claimNumber: 1,
    claimDate: '2026-04-30',
    claimPeriod: 'April 2026',
    amount: 12600000,
    retentionPct: 5,
    status: 'Scheduled',
    dueDate: '2026-06-25',
  },
]

export const prelimLines: PrelimLine[] = [
  // PRJ-2026-001
  { id: 'prel-1', projectId: 'proj-1', category: 'Site Establishment', description: 'Site fencing, hoarding, signage, site shed and amenities', budgeted: 1800000, actual: 1920000, status: 'Complete', notes: 'Over budget due to council requirement for additional hoarding.' },
  { id: 'prel-2', projectId: 'proj-1', category: 'Temporary Services', description: 'Temp power, water, telecommunications connections', budgeted: 650000, actual: 610000, status: 'Complete', notes: '' },
  { id: 'prel-3', projectId: 'proj-1', category: 'Crane & Lifting', description: 'Mobile crane hire for pod placement — 12 lifts', budgeted: 4200000, actual: 3950000, status: 'In Progress', notes: 'Under budget. 8 of 12 lifts complete.' },
  { id: 'prel-4', projectId: 'proj-1', category: 'Project Management', description: 'PM fees, site superintendent, site admin', budgeted: 7400000, actual: 7400000, status: 'In Progress', notes: '' },
  { id: 'prel-5', projectId: 'proj-1', category: 'Insurance', description: 'Contract works, public liability, WC insurance', budgeted: 2100000, actual: 2100000, status: 'Complete', notes: '' },
  { id: 'prel-6', projectId: 'proj-1', category: 'Compliance & Inspections', description: 'BCA compliance consultant, staged inspections', budgeted: 900000, actual: 1100000, status: 'In Progress', notes: 'Two additional inspections requested by certifier.' },
  { id: 'prel-7', projectId: 'proj-1', category: 'Waste Management', description: 'Skip bins, waste segregation, removal', budgeted: 480000, actual: 390000, status: 'In Progress', notes: '' },
  { id: 'prel-8', projectId: 'proj-1', category: 'Safety', description: 'SWMS documentation, safety officer visits, PPE', budgeted: 550000, actual: 520000, status: 'In Progress', notes: '' },
  // PRJ-2026-002
  { id: 'prel-9', projectId: 'proj-2', category: 'Site Establishment', description: 'Hoardings, protection to existing fitout, signage', budgeted: 420000, actual: 380000, status: 'Complete', notes: '' },
  { id: 'prel-10', projectId: 'proj-2', category: 'Temporary Services', description: 'Temp lighting, power boards, comms', budgeted: 180000, actual: 195000, status: 'In Progress', notes: 'Additional temp lighting required for inner zones.' },
  { id: 'prel-11', projectId: 'proj-2', category: 'Project Management', description: 'PM and site supervisor fees', budgeted: 1950000, actual: 975000, status: 'In Progress', notes: '50% through project.' },
  { id: 'prel-12', projectId: 'proj-2', category: 'Insurance', description: 'Contract works and public liability', budgeted: 580000, actual: 580000, status: 'Complete', notes: '' },
  { id: 'prel-13', projectId: 'proj-2', category: 'Compliance & Inspections', description: 'NCC BCA commercial compliance and certifier fees', budgeted: 320000, actual: 320000, status: 'Not Started', notes: '' },
  { id: 'prel-14', projectId: 'proj-2', category: 'Waste Management', description: 'Demo waste, skip bins', budgeted: 150000, actual: 88000, status: 'In Progress', notes: '' },
  { id: 'prel-15', projectId: 'proj-2', category: 'Safety', description: 'Safety plan, SWMS, first aid', budgeted: 95000, actual: 45000, status: 'In Progress', notes: '' },
  // PRJ-2026-003 (all Not Started — Tender)
  { id: 'prel-16', projectId: 'proj-3', category: 'Site Establishment', description: 'Fencing, site amenities, signage', budgeted: 850000, actual: 0, status: 'Not Started', notes: '' },
  { id: 'prel-17', projectId: 'proj-3', category: 'Temporary Services', description: 'Temp power and water', budgeted: 320000, actual: 0, status: 'Not Started', notes: '' },
  { id: 'prel-18', projectId: 'proj-3', category: 'Project Management', description: 'PM, site super, admin — 16 months', budgeted: 8800000, actual: 0, status: 'Not Started', notes: '' },
  { id: 'prel-19', projectId: 'proj-3', category: 'Insurance', description: 'Contract works, PL, WC', budgeted: 2500000, actual: 0, status: 'Not Started', notes: '' },
  { id: 'prel-20', projectId: 'proj-3', category: 'Compliance & Inspections', description: 'Building certifier, staged inspections', budgeted: 780000, actual: 0, status: 'Not Started', notes: '' },
  { id: 'prel-21', projectId: 'proj-3', category: 'Waste Management', description: 'Skip bins, waste removal', budgeted: 420000, actual: 0, status: 'Not Started', notes: '' },
  { id: 'prel-22', projectId: 'proj-3', category: 'Safety', description: 'SafeWork SA compliance, SWMS', budgeted: 360000, actual: 0, status: 'Not Started', notes: '' },
]

export const diaryEntries: DiaryEntry[] = [
  // PRJ-2026-001
  {
    id: 'diary-1', projectId: 'proj-1', date: '2026-06-16',
    weather: 'Partly Cloudy',
    workCompleted: 'Electrical rough-in complete pods 33–40. Tiling commenced pod 25. Plumbing final inspection pods 1–24 passed.',
    delays: 'None',
    visitors: 'James Whitfield (Landmark) — site walk, satisfied with progress.',
    hasIssues: false,
  },
  {
    id: 'diary-2', projectId: 'proj-1', date: '2026-06-13',
    weather: 'Rain',
    workCompleted: 'Internal works only — electrical cabling pods 30–32. Pod frame QA audit completed by structural engineer.',
    delays: 'Crane lift postponed — rescheduled Monday 16 June.',
    visitors: 'Council inspector — framing sign-off for batch 3.',
    hasIssues: true,
  },
  {
    id: 'diary-3', projectId: 'proj-1', date: '2026-06-12',
    weather: 'Sunny',
    workCompleted: 'Crane lift — pods 41–44 placed on footings. Tiling complete pods 20–24. Touch-up painting commenced.',
    delays: 'None',
    visitors: 'None',
    hasIssues: false,
  },
  // PRJ-2026-002
  {
    id: 'diary-4', projectId: 'proj-2', date: '2026-06-16',
    weather: 'Overcast',
    workCompleted: 'Electrical conduit installation — zones A and B complete. Plumber on site for kitchen rough-in. Partition framing 60% complete.',
    delays: 'None',
    visitors: 'Priya Mehta (Cooper Street) — design query on meeting room 2 partition height.',
    hasIssues: false,
  },
  {
    id: 'diary-5', projectId: 'proj-2', date: '2026-06-14',
    weather: 'Sunny',
    workCompleted: 'Demolition of existing partitions complete. New partition tracks installed. Electrical marked out zones A–D.',
    delays: 'Asbestos report clearance delayed by 1 day — works paused in Zone C.',
    visitors: 'SafeWork inspector — routine site visit, no issues raised.',
    hasIssues: true,
  },
  {
    id: 'diary-6', projectId: 'proj-2', date: '2026-06-12',
    weather: 'Sunny',
    workCompleted: 'Strip out of existing ceiling tiles and services. Waste removal completed. Site clean and ready for partition works.',
    delays: 'None',
    visitors: 'Fire services engineer — existing sprinkler system survey.',
    hasIssues: false,
  },
]

// Derived helpers
export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id)
}
export function getClientById(id: string): Client | undefined {
  return clients.find(c => c.id === id)
}
export function getTradieById(id: string): Tradie | undefined {
  return tradies.find(t => t.id === id)
}
export function getWorkOrdersByProject(projectId: string): WorkOrder[] {
  return workOrders.filter(wo => wo.projectId === projectId)
}
export function getClaimsByProject(projectId: string): PaymentClaim[] {
  return paymentClaims.filter(c => c.projectId === projectId)
}
export function getPrelimsByProject(projectId: string): PrelimLine[] {
  return prelimLines.filter(p => p.projectId === projectId)
}
export function getDiaryByProject(projectId: string): DiaryEntry[] {
  return diaryEntries.filter(d => d.projectId === projectId).sort((a, b) => b.date.localeCompare(a.date))
}
export function getProjectsByClient(clientId: string): Project[] {
  return projects.filter(p => p.clientId === clientId)
}
