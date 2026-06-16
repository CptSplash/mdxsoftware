export interface GanttTask {
  n: string       // task name
  s: number       // start week
  e: number       // end week
  who: string     // responsible trade/person
  risk?: boolean  // flag as delay risk
}

export interface GanttGroup {
  name: string
  color: string
  tasks: GanttTask[]
}

export interface GanttPath {
  id: string
  name: string
  weeks: number
  months: string
  cost: string
  trades: string
  risks: string[]
  groups: GanttGroup[]
}

export const GANTT_PATHS: GanttPath[] = [
  {
    id: 'traditional',
    name: 'Traditional Build',
    weeks: 64,
    months: '~15–16 months',
    cost: '$3,500–$5,000/m²',
    trades: 'Builder, Plumber, Electrician, Civil Eng., Architect, Roofer, Plasterer, Painter, Landscaper',
    risks: [
      'DA approval delay: council queues in NSW/VIC often 16–26 weeks (add 4–8 wk buffer)',
      'Trade availability: plumbers & electricians on critical path — book 8+ wks ahead',
      'Concrete pour weather: avoid school holidays, QC cure time non-negotiable',
      'Procurement lead: China-sourced windows/tiles need 12–14 wk ship + customs buffer',
    ],
    groups: [
      { name: 'A. Land & Engagement', color: '#374151', tasks: [
        { n: 'Land Acquisition / Settlement', s: 0, e: 4, who: 'Owner / Conveyancer' },
        { n: 'Survey & Title Check', s: 1, e: 3, who: 'Land Surveyor' },
        { n: 'Site Analysis (geotech, contours)', s: 2, e: 5, who: 'Civil Engineer' },
      ]},
      { name: 'B. Design', color: '#1e40af', tasks: [
        { n: 'Design Brief & Concept', s: 3, e: 6, who: 'Architect' },
        { n: 'Architectural Drawings (DA set)', s: 5, e: 11, who: 'Architect' },
        { n: 'Structural Engineering', s: 8, e: 13, who: 'Civil/Structural Eng.' },
        { n: 'Energy Report (NatHERS / BASIX)', s: 10, e: 13, who: 'Energy Assessor' },
        { n: 'Hydraulic / Civil Design', s: 9, e: 12, who: 'Civil Engineer' },
      ]},
      { name: 'C. Approvals', color: '#166534', tasks: [
        { n: 'DA Submission', s: 11, e: 12, who: 'Owner / Architect' },
        { n: 'DA Assessment — Council', s: 12, e: 28, who: 'Council (LGA)', risk: true },
        { n: 'BA/CDC Preparation', s: 22, e: 26, who: 'Private Certifier' },
        { n: 'BA/CDC Approval', s: 26, e: 28, who: 'Private Certifier' },
      ]},
      { name: 'D. Procurement', color: '#7c2d12', tasks: [
        { n: 'Structural Steel / Timber Frame', s: 20, e: 28, who: 'Builder' },
        { n: 'Windows & Doors (China import)', s: 19, e: 32, who: 'Supplier', risk: true },
        { n: 'Tiles & Interior Finishes (China)', s: 21, e: 34, who: 'Supplier', risk: true },
        { n: 'Joinery & Cabinets', s: 28, e: 36, who: 'Cabinetmaker' },
      ]},
      { name: 'E. Groundworks & Foundation', color: '#6d28d9', tasks: [
        { n: 'Site Clearing & Temp Services', s: 27, e: 29, who: 'Builder' },
        { n: 'Survey Set-Out', s: 28, e: 29, who: 'Land Surveyor' },
        { n: 'Excavation', s: 29, e: 31, who: 'Excavator' },
        { n: 'Strip/Pad Footings Pour', s: 30, e: 33, who: 'Concreter' },
        { n: 'Plumbing Lay-ins (sub-slab)', s: 31, e: 33, who: 'Plumber' },
        { n: 'Electrical Lay-ins (sub-slab)', s: 31, e: 33, who: 'Electrician' },
        { n: 'Reo Check & Inspection', s: 32, e: 33, who: 'Civil Eng. / Certifier' },
        { n: 'Slab Pour & Cure', s: 33, e: 36, who: 'Concreter' },
      ]},
      { name: 'F. Superstructure — Frame & Shell', color: '#5b21b6', tasks: [
        { n: 'Wall Framing', s: 36, e: 39, who: 'Builder / Carpenter' },
        { n: 'Floor Framing (multi-level)', s: 37, e: 40, who: 'Builder / Carpenter' },
        { n: 'Roof Framing (trusses/rafters)', s: 39, e: 42, who: 'Builder / Carpenter' },
        { n: 'Roof Covering (tiles/Colorbond)', s: 41, e: 43, who: 'Roofer' },
        { n: 'Windows & External Doors', s: 42, e: 44, who: 'Builder' },
        { n: 'Cladding (brick/render/clad)', s: 42, e: 45, who: 'Builder' },
        { n: 'Insulation & Sarking', s: 43, e: 45, who: 'Builder' },
      ]},
      { name: 'G. First Fix — Services', color: '#0e7490', tasks: [
        { n: 'Plumbing Rough-in', s: 45, e: 48, who: 'Plumber' },
        { n: 'Electrical Rough-in', s: 45, e: 48, who: 'Electrician' },
        { n: 'HVAC Ducts & Systems', s: 46, e: 49, who: 'HVAC Tech' },
        { n: 'NBN / Data Pre-wire', s: 47, e: 48, who: 'Network' },
      ]},
      { name: 'H. Internal Works', color: '#0f766e', tasks: [
        { n: 'Internal Linings (Gyprock / FC)', s: 48, e: 51, who: 'Builder — Plasterer' },
        { n: 'Waterproofing (wet areas AS 3740)', s: 50, e: 52, who: 'Waterproofer' },
        { n: 'Screeds & Subfloor Finishes', s: 51, e: 53, who: 'Builder' },
      ]},
      { name: 'I. Second Fix — Fit-Off', color: '#065f46', tasks: [
        { n: 'Joinery Installation (kitchen/bath)', s: 52, e: 55, who: 'Cabinetmaker' },
        { n: 'Plumbing Fit-Off (taps/toilets)', s: 54, e: 57, who: 'Plumber' },
        { n: 'Electrical Fit-Off (lights/points)', s: 54, e: 57, who: 'Electrician' },
        { n: 'Windows & Doors Hardware', s: 54, e: 56, who: 'Builder / Carpenter' },
        { n: 'Floor Finishes (tiles/timber/carpet)', s: 55, e: 58, who: 'Floor Layer' },
      ]},
      { name: 'J. Finishes & External', color: '#1a4731', tasks: [
        { n: 'Painting — Internal & External', s: 56, e: 60, who: 'Painter' },
        { n: 'Final Cladding / Gutters / Fascias', s: 57, e: 60, who: 'Builder' },
        { n: 'Landscaping & Driveway', s: 58, e: 62, who: 'Landscaper' },
      ]},
      { name: 'K. Inspections & Handover', color: '#374151', tasks: [
        { n: 'Final Plumbing / Electrical Certs', s: 59, e: 61, who: 'Plumber / Electrician' },
        { n: 'Final Building Inspection', s: 60, e: 62, who: 'Private Certifier' },
        { n: 'Defects Rectification', s: 61, e: 63, who: 'Builder' },
        { n: 'Occupancy Certificate (OC)', s: 62, e: 63, who: 'Certifier / Council' },
        { n: 'Practical Completion & Handover', s: 63, e: 64, who: 'Builder → Client' },
      ]},
    ],
  },
  {
    id: 'amj',
    name: 'Modular Panel — AMJ',
    weeks: 50,
    months: '~12 months',
    cost: '$2,800–$3,800/m²',
    trades: 'Builder, Crane Operator, AMJ Install Team, Plumber, Electrician, Civil Eng., Architect',
    risks: [
      'DA still required — council processing time unchanged (16–24 wk)',
      'AMJ factory lead: 10–14 wk production; book factory slot at DA submission',
      'Shipping: 4–5 wk sea freight China→AU + 1–2 wk customs clearance',
      'Crane access: book crane 4+ wks ahead; panel erection weather-sensitive',
    ],
    groups: [
      { name: 'A. Land & Engagement', color: '#374151', tasks: [
        { n: 'Land Acquisition / Settlement', s: 0, e: 4, who: 'Owner / Conveyancer' },
        { n: 'Survey & Title Check', s: 1, e: 3, who: 'Land Surveyor' },
        { n: 'Site Analysis (geotech, crane access)', s: 2, e: 5, who: 'Civil Engineer' },
      ]},
      { name: 'B. Design (AMJ Panel System)', color: '#1e40af', tasks: [
        { n: 'Design Brief & AMJ Panel Config', s: 3, e: 6, who: 'Architect + AMJ' },
        { n: 'Architectural Drawings (DA set)', s: 5, e: 9, who: 'Architect' },
        { n: 'Structural Engineering (panel loads)', s: 7, e: 11, who: 'Civil/Structural Eng.' },
        { n: 'Energy Report (NatHERS / BASIX)', s: 8, e: 10, who: 'Energy Assessor' },
      ]},
      { name: 'C. Approvals', color: '#166534', tasks: [
        { n: 'DA Submission', s: 9, e: 10, who: 'Owner / Architect' },
        { n: 'DA Assessment — Council', s: 10, e: 26, who: 'Council (LGA)', risk: true },
        { n: 'BA/CDC Preparation (panel docs)', s: 20, e: 23, who: 'Private Certifier' },
        { n: 'BA/CDC Approval', s: 23, e: 25, who: 'Private Certifier' },
      ]},
      { name: 'D. Factory Production & Shipping', color: '#7c2d12', tasks: [
        { n: 'AMJ Factory Production (panels)', s: 12, e: 24, who: 'AMJ (China)' },
        { n: 'QC Inspection at Factory', s: 22, e: 24, who: '3rd-Party Inspector' },
        { n: 'Sea Freight + Customs', s: 24, e: 28, who: 'Freight Forwarder', risk: true },
        { n: 'Finishes & Fitout Procurement', s: 18, e: 28, who: 'Builder' },
      ]},
      { name: 'E. Groundworks & Foundation', color: '#6d28d9', tasks: [
        { n: 'Site Clearing & Temp Services', s: 26, e: 28, who: 'Builder' },
        { n: 'Survey Set-Out', s: 27, e: 28, who: 'Land Surveyor' },
        { n: 'Excavation', s: 28, e: 30, who: 'Excavator' },
        { n: 'Footings Pour', s: 30, e: 32, who: 'Concreter' },
        { n: 'Plumbing & Elec Lay-ins (slab)', s: 31, e: 33, who: 'Plumber / Electrician' },
        { n: 'Slab Pour & Cure', s: 33, e: 35, who: 'Concreter' },
      ]},
      { name: 'F. Panel Erection & Shell', color: '#5b21b6', tasks: [
        { n: 'Panel Delivery to Site', s: 35, e: 36, who: 'AMJ / Freight' },
        { n: 'Crane & Panel Erection', s: 36, e: 38, who: 'AMJ Install + Crane Op.' },
        { n: 'Roof System Install', s: 37, e: 39, who: 'Roofer' },
        { n: 'Windows & Doors (pre-fitted)', s: 37, e: 39, who: 'Builder' },
      ]},
      { name: 'G. First Fix — Services', color: '#0e7490', tasks: [
        { n: 'Plumbing Rough-in', s: 39, e: 41, who: 'Plumber' },
        { n: 'Electrical Rough-in', s: 39, e: 41, who: 'Electrician' },
        { n: 'HVAC', s: 40, e: 42, who: 'HVAC Tech' },
      ]},
      { name: 'H. Internal Works', color: '#0f766e', tasks: [
        { n: 'Internal Linings (Gyprock)', s: 41, e: 43, who: 'Builder — Plasterer' },
        { n: 'Waterproofing (wet areas)', s: 42, e: 44, who: 'Waterproofer' },
        { n: 'Screeds & Subfloor', s: 43, e: 45, who: 'Builder' },
      ]},
      { name: 'I. Second Fix — Fit-Off', color: '#065f46', tasks: [
        { n: 'Joinery (kitchen/bath cabs)', s: 44, e: 46, who: 'Cabinetmaker' },
        { n: 'Plumbing Fit-Off', s: 45, e: 47, who: 'Plumber' },
        { n: 'Electrical Fit-Off', s: 45, e: 47, who: 'Electrician' },
        { n: 'Floor Finishes', s: 46, e: 48, who: 'Floor Layer' },
      ]},
      { name: 'J. Finishes & Handover', color: '#1a4731', tasks: [
        { n: 'Painting', s: 47, e: 49, who: 'Painter' },
        { n: 'Landscaping', s: 47, e: 50, who: 'Landscaper' },
        { n: 'Final Inspections & Certs', s: 49, e: 50, who: 'Certifier' },
        { n: 'OC & Practical Completion', s: 50, e: 50, who: 'Builder → Client' },
      ]},
    ],
  },
  {
    id: 'gsmod',
    name: 'Modular Pods — GSMOD',
    weeks: 40,
    months: '~9–10 months',
    cost: '$2,200–$3,200/m²',
    trades: 'Builder, Crane Operator, GSMOD Install Team, Plumber, Electrician, Civil Engineer',
    risks: [
      'DA still required even for pods — check SEPP Housing 2021 / CDC eligibility first',
      'GSMOD lead time: 12–14 wk production; book at DA lodgement, not approval',
      'Shipping: 4–5 wk sea + 1–2 wk customs; allow 6–7 wk total buffer',
      'Crane access on tight sites: may need road closures (council permit, 4 wk lead)',
    ],
    groups: [
      { name: 'A. Land & Engagement', color: '#374151', tasks: [
        { n: 'Land Acquisition / Settlement', s: 0, e: 4, who: 'Owner / Conveyancer' },
        { n: 'Survey & Title Check', s: 1, e: 3, who: 'Land Surveyor' },
        { n: 'Site Analysis (crane access, fall)', s: 2, e: 4, who: 'Civil Engineer' },
      ]},
      { name: 'B. Design (Pod Selection)', color: '#1e40af', tasks: [
        { n: 'Design Brief & GSMOD Pod Config', s: 3, e: 5, who: 'Owner + Architect + GSMOD' },
        { n: 'Architectural DA Plans', s: 4, e: 7, who: 'Architect' },
        { n: 'Footing / Pad Engineering', s: 5, e: 8, who: 'Civil/Structural Eng.' },
        { n: 'Energy Report', s: 6, e: 8, who: 'Energy Assessor' },
      ]},
      { name: 'C. Approvals', color: '#166534', tasks: [
        { n: 'DA Submission', s: 8, e: 9, who: 'Owner / Architect' },
        { n: 'DA Assessment — Council', s: 9, e: 25, who: 'Council (LGA)', risk: true },
        { n: 'BA (pods pre-certified — faster)', s: 22, e: 24, who: 'Private Certifier' },
      ]},
      { name: 'D. GSMOD Manufacture & Shipping', color: '#7c2d12', tasks: [
        { n: 'GSMOD Pod Manufacture (factory)', s: 10, e: 24, who: 'GSMOD (China)' },
        { n: 'QC Inspection at Factory', s: 22, e: 24, who: '3rd-Party Inspector' },
        { n: 'Sea Freight + Customs', s: 24, e: 28, who: 'Freight Forwarder', risk: true },
      ]},
      { name: 'E. Groundworks — Pad Footings Only', color: '#6d28d9', tasks: [
        { n: 'Site Clearing', s: 26, e: 27, who: 'Builder' },
        { n: 'Survey Set-Out', s: 26, e: 27, who: 'Land Surveyor' },
        { n: 'Excavation (pad footings only)', s: 27, e: 29, who: 'Excavator' },
        { n: 'Pad Footings Pour & Cure', s: 28, e: 31, who: 'Concreter' },
        { n: 'Services Rough-in to Connection Pts', s: 30, e: 32, who: 'Plumber / Electrician' },
      ]},
      { name: 'F. Pod Delivery & Installation', color: '#5b21b6', tasks: [
        { n: 'Pod Delivery to Site', s: 31, e: 32, who: 'GSMOD / Freight' },
        { n: 'Crane & Pod Placement', s: 32, e: 33, who: 'GSMOD Install + Crane Op.' },
        { n: 'Pod-to-Pod Structural Connections', s: 33, e: 34, who: 'Builder + GSMOD' },
      ]},
      { name: 'G. Site Connections', color: '#0e7490', tasks: [
        { n: 'Plumbing Connections (pod to mains)', s: 33, e: 35, who: 'Plumber' },
        { n: 'Electrical Connections & Switchboard', s: 33, e: 35, who: 'Electrician' },
        { n: 'HVAC & Ventilation Fit-off', s: 34, e: 36, who: 'HVAC Tech' },
      ]},
      { name: 'H. Fit-Off & Finishes', color: '#065f46', tasks: [
        { n: 'Internal Fit-Off (pre-fitted in pods)', s: 35, e: 37, who: 'Builder' },
        { n: 'External Cladding & Connections', s: 35, e: 37, who: 'Builder' },
        { n: 'Landscaping', s: 36, e: 38, who: 'Landscaper' },
      ]},
      { name: 'I. Inspections & Handover', color: '#374151', tasks: [
        { n: 'Final Plumbing / Electrical Certs', s: 37, e: 38, who: 'Plumber / Electrician' },
        { n: 'Final Building Inspection', s: 38, e: 39, who: 'Private Certifier' },
        { n: 'OC & Practical Completion', s: 39, e: 40, who: 'Builder → Client' },
      ]},
    ],
  },
]

/** Pick the most relevant Gantt path based on project type */
export function defaultPathIndex(projectType: string): number {
  if (projectType === 'Pod/Modular') return 2   // GSMOD pods
  if (projectType === 'Residential') return 0    // Traditional build
  return 0
}
