export type ProjectStatus = 'Tender' | 'Active' | 'Practical Completion' | 'Defects' | 'Closed'
export type ProjectType = 'Residential' | 'Commercial' | 'Renovation' | 'Fit-out' | 'Pod/Modular'
export type ContractType = 'Lump Sum' | 'Cost-Plus' | 'Schedule of Rates'
export type TradeType = 'Concretor' | 'Framer' | 'Electrician' | 'Plumber' | 'Tiler' | 'Painter' | 'Plasterer' | 'Renderer' | 'Roofer' | 'Bricklayer' | 'Cabinetmaker' | 'Glazier' | 'Landscaper' | 'Other'
export type WorkOrderStatus = 'Invited' | 'Quoted' | 'Accepted' | 'On Site' | 'Complete' | 'Invoiced' | 'Paid'
export type ClaimStatus = 'Claimed' | 'Scheduled' | 'Paid' | 'Disputed'

export interface Project {
  id: string; projectNumber: string; name: string; type: ProjectType; status: ProjectStatus
  contractValue: number; contractType: ContractType; startDate: string; endDate: string
  siteAddress: string; percentComplete: number; clientId: string; notes: string; accentColor: string
}

export interface Client {
  id: string; name: string; abn?: string; contactPerson: string; phone: string
  email: string; address: string; clientType: 'Owner-Builder' | 'Developer' | 'Council' | 'Commercial'; notes: string
}

export interface Tradie {
  id: string; businessName: string; tradeType: TradeType; contactName: string; phone: string
  email: string; abn?: string; licenceNumber?: string; licenceExpiry?: string
  insuranceExpiry?: string; rating: 1|2|3|4|5; notes: string; states: string[]
  status: 'Available' | 'Busy' | 'Do Not Use'
}

export interface WorkOrder {
  id: string; projectId: string; tradieId: string; scope: string
  quotedPrice: number; startDate: string; duration: number; status: WorkOrderStatus; notes: string
}

export interface PaymentClaim {
  id: string; projectId: string; claimNumber: number; claimDate: string
  claimPeriod: string; amount: number; retentionPct: number; status: ClaimStatus; dueDate: string
}

export interface PrelimLine {
  id: string; projectId: string; category: string; description: string
  budgeted: number; actual: number; status: 'Not Started' | 'In Progress' | 'Complete'; notes: string
}

export interface DiaryEntry {
  id: string; projectId: string; date: string
  weather: 'Sunny' | 'Partly Cloudy' | 'Overcast' | 'Rain' | 'Wind' | 'Extreme'
  workCompleted: string; delays: string; visitors: string; hasIssues: boolean
}

export interface ProjectFile {
  id: string; projectId: string; folder: string; filename: string
  r2Key: string; fileSize: number; contentType: string; createdAt: string
}

export type GanttTaskStatus = 'pending' | 'in_progress' | 'complete' | 'delayed' | 'blocked'

export interface GanttTaskRow {
  id: string; projectId: string; pathId: string
  groupName: string; groupColor: string; taskName: string; responsible: string
  plannedStart: number; plannedEnd: number
  actualStart: number | null; actualEnd: number | null
  status: GanttTaskStatus; notes: string; isRisk: boolean; sortOrder: number
}

export interface GanttTaskOverride {
  id: string
  projectId: string
  pathId: string
  taskKey: string       // `${groupName}::${taskName}`
  startDate: string | null
  endDate: string | null
  notes: string
}

export interface ScheduleMilestone {
  id: string
  projectId: string
  key: string
  label: string
  date: string | null
  notes: string
}

export type CardColumn = 'Backlog' | 'To Do' | 'In Progress' | 'In Review' | 'Done'
export type CardPriority = 'Low' | 'Medium' | 'High' | 'Urgent'

export interface CardAssignee {
  name: string; initials: string; color: string
}

export interface TaskCard {
  id: string; projectId: string; title: string; description: string
  columnName: CardColumn; assignees: CardAssignee[]; priority: CardPriority
  dueDate: string | null; sortOrder: number; createdAt: string
}
