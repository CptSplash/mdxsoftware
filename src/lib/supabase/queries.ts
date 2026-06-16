import type { Project, Client, Tradie, WorkOrder, PaymentClaim, PrelimLine, DiaryEntry, ProjectFile } from '@/lib/types'

// Check if Supabase is actually configured
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return !!url && url !== 'https://placeholder.supabase.co'
}

// Row mappers (snake_case DB → camelCase TS)
function mapProject(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    projectNumber: row.project_number as string,
    name: row.name as string,
    type: row.type as Project['type'],
    status: row.status as Project['status'],
    contractValue: row.contract_value as number,
    contractType: row.contract_type as Project['contractType'],
    startDate: row.start_date as string,
    endDate: row.end_date as string,
    siteAddress: row.site_address as string,
    percentComplete: row.percent_complete as number,
    clientId: row.client_id as string,
    notes: row.notes as string,
    accentColor: row.accent_color as string,
  }
}

function mapClient(row: Record<string, unknown>): Client {
  return {
    id: row.id as string,
    name: row.name as string,
    abn: row.abn as string | undefined,
    contactPerson: row.contact_person as string,
    phone: row.phone as string,
    email: row.email as string,
    address: row.address as string,
    clientType: row.client_type as Client['clientType'],
    notes: row.notes as string,
  }
}

function mapTradie(row: Record<string, unknown>): Tradie {
  return {
    id: row.id as string,
    businessName: row.business_name as string,
    tradeType: row.trade_type as Tradie['tradeType'],
    contactName: row.contact_name as string,
    phone: row.phone as string,
    email: row.email as string,
    abn: row.abn as string | undefined,
    licenceNumber: row.licence_number as string | undefined,
    licenceExpiry: row.licence_expiry as string | undefined,
    insuranceExpiry: row.insurance_expiry as string | undefined,
    rating: row.rating as Tradie['rating'],
    notes: row.notes as string,
    states: (row.states as string[]) || [],
    status: row.status as Tradie['status'],
  }
}

function mapWorkOrder(row: Record<string, unknown>): WorkOrder {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    tradieId: row.tradie_id as string,
    scope: row.scope as string,
    quotedPrice: row.quoted_price as number,
    startDate: row.start_date as string,
    duration: row.duration as number,
    status: row.status as WorkOrder['status'],
    notes: row.notes as string,
  }
}

function mapClaim(row: Record<string, unknown>): PaymentClaim {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    claimNumber: row.claim_number as number,
    claimDate: row.claim_date as string,
    claimPeriod: row.claim_period as string,
    amount: row.amount as number,
    retentionPct: row.retention_pct as number,
    status: row.status as PaymentClaim['status'],
    dueDate: row.due_date as string,
  }
}

function mapPrelim(row: Record<string, unknown>): PrelimLine {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    category: row.category as string,
    description: row.description as string,
    budgeted: row.budgeted as number,
    actual: row.actual as number,
    status: row.status as PrelimLine['status'],
    notes: row.notes as string,
  }
}

function mapDiary(row: Record<string, unknown>): DiaryEntry {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    date: row.date as string,
    weather: row.weather as DiaryEntry['weather'],
    workCompleted: row.work_completed as string,
    delays: row.delays as string,
    visitors: row.visitors as string,
    hasIssues: row.has_issues as boolean,
  }
}

// --- Mock data fallback imports ---
import {
  projects as mockProjects,
  clients as mockClients,
  tradies as mockTradies,
  workOrders as mockWorkOrders,
  paymentClaims as mockClaims,
  prelimLines as mockPrelims,
  diaryEntries as mockDiary,
} from '@/lib/mock-data'

async function getSupabase() {
  const { createClient } = await import('./server')
  return createClient()
}

// --- Query functions ---

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return mockProjects
  const sb = await getSupabase()
  const { data, error } = await sb.from('projects').select('*').order('created_at', { ascending: false })
  if (error || !data) return mockProjects
  return data.map(mapProject)
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) return mockProjects.find(p => p.id === id) ?? null
  const sb = await getSupabase()
  const { data } = await sb.from('projects').select('*').eq('id', id).single()
  return data ? mapProject(data as Record<string, unknown>) : null
}

export async function getClients(): Promise<Client[]> {
  if (!isSupabaseConfigured()) return mockClients
  const sb = await getSupabase()
  const { data, error } = await sb.from('clients').select('*').order('name')
  if (error || !data) return mockClients
  return data.map(mapClient)
}

export async function getClientById(id: string): Promise<Client | null> {
  if (!isSupabaseConfigured()) return mockClients.find(c => c.id === id) ?? null
  const sb = await getSupabase()
  const { data } = await sb.from('clients').select('*').eq('id', id).single()
  return data ? mapClient(data as Record<string, unknown>) : null
}

export async function getTradies(): Promise<Tradie[]> {
  if (!isSupabaseConfigured()) return mockTradies
  const sb = await getSupabase()
  const { data, error } = await sb.from('tradies').select('*').order('business_name')
  if (error || !data) return mockTradies
  return data.map(mapTradie)
}

export async function getTradieById(id: string): Promise<Tradie | null> {
  if (!isSupabaseConfigured()) return mockTradies.find(t => t.id === id) ?? null
  const sb = await getSupabase()
  const { data } = await sb.from('tradies').select('*').eq('id', id).single()
  return data ? mapTradie(data as Record<string, unknown>) : null
}

export async function getWorkOrders(): Promise<WorkOrder[]> {
  if (!isSupabaseConfigured()) return mockWorkOrders
  const sb = await getSupabase()
  const { data, error } = await sb.from('work_orders').select('*').order('created_at', { ascending: false })
  if (error || !data) return mockWorkOrders
  return data.map(mapWorkOrder)
}

export async function getWorkOrdersByProject(projectId: string): Promise<WorkOrder[]> {
  if (!isSupabaseConfigured()) return mockWorkOrders.filter(w => w.projectId === projectId)
  const sb = await getSupabase()
  const { data, error } = await sb.from('work_orders').select('*').eq('project_id', projectId).order('start_date')
  if (error || !data) return mockWorkOrders.filter(w => w.projectId === projectId)
  return data.map(mapWorkOrder)
}

export async function getClaimsByProject(projectId: string): Promise<PaymentClaim[]> {
  if (!isSupabaseConfigured()) return mockClaims.filter(c => c.projectId === projectId)
  const sb = await getSupabase()
  const { data, error } = await sb.from('payment_claims').select('*').eq('project_id', projectId).order('claim_number')
  if (error || !data) return mockClaims.filter(c => c.projectId === projectId)
  return data.map(mapClaim)
}

export async function getAllClaims(): Promise<PaymentClaim[]> {
  if (!isSupabaseConfigured()) return mockClaims
  const sb = await getSupabase()
  const { data, error } = await sb.from('payment_claims').select('*').order('due_date')
  if (error || !data) return mockClaims
  return data.map(mapClaim)
}

export async function getPrelimsByProject(projectId: string): Promise<PrelimLine[]> {
  if (!isSupabaseConfigured()) return mockPrelims.filter(p => p.projectId === projectId)
  const sb = await getSupabase()
  const { data, error } = await sb.from('prelim_lines').select('*').eq('project_id', projectId).order('sort_order')
  if (error || !data) return mockPrelims.filter(p => p.projectId === projectId)
  return data.map(mapPrelim)
}

export async function getDiaryByProject(projectId: string): Promise<DiaryEntry[]> {
  if (!isSupabaseConfigured()) return mockDiary.filter(d => d.projectId === projectId)
  const sb = await getSupabase()
  const { data, error } = await sb.from('diary_entries').select('*').eq('project_id', projectId).order('date', { ascending: false })
  if (error || !data) return mockDiary.filter(d => d.projectId === projectId)
  return data.map(mapDiary)
}

export async function getAllDiary(): Promise<DiaryEntry[]> {
  if (!isSupabaseConfigured()) return mockDiary
  const sb = await getSupabase()
  const { data, error } = await sb.from('diary_entries').select('*').order('date', { ascending: false })
  if (error || !data) return mockDiary
  return data.map(mapDiary)
}

export async function getProjectsByClient(clientId: string): Promise<Project[]> {
  if (!isSupabaseConfigured()) return mockProjects.filter(p => p.clientId === clientId)
  const sb = await getSupabase()
  const { data, error } = await sb.from('projects').select('*').eq('client_id', clientId).order('created_at', { ascending: false })
  if (error || !data) return mockProjects.filter(p => p.clientId === clientId)
  return data.map(mapProject)
}

function mapProjectFile(row: Record<string, unknown>): ProjectFile {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    folder: row.folder as string,
    filename: row.filename as string,
    r2Key: row.r2_key as string,
    fileSize: row.file_size as number,
    contentType: row.content_type as string,
    createdAt: row.created_at as string,
  }
}

export async function getProjectFiles(projectId: string): Promise<ProjectFile[]> {
  if (!isSupabaseConfigured()) return []
  const sb = await getSupabase()
  const { data, error } = await sb
    .from('project_files')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return data.map(r => mapProjectFile(r as Record<string, unknown>))
}
