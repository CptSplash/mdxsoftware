'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from './server'

// --- Projects ---
export async function createProject(formData: FormData) {
  const sb = createClient()
  const contractValueStr = formData.get('contractValue') as string
  const contractValueCents = Math.round(parseFloat(contractValueStr.replace(/[^0-9.]/g, '')) * 100)
  const { error } = await sb.from('projects').insert({
    project_number: formData.get('projectNumber'),
    name: formData.get('name'),
    type: formData.get('type'),
    status: formData.get('status') || 'Tender',
    contract_value: contractValueCents,
    contract_type: formData.get('contractType') || 'Lump Sum',
    start_date: formData.get('startDate'),
    end_date: formData.get('endDate'),
    site_address: formData.get('siteAddress'),
    percent_complete: 0,
    client_id: formData.get('clientId'),
    notes: formData.get('notes') || '',
    accent_color: formData.get('accentColor') || '#1E3A5F',
  })
  if (error) throw new Error(error.message)
  revalidatePath('/projects')
  revalidatePath('/')
}

export async function updateProjectProgress(projectId: string, percentComplete: number) {
  const sb = createClient()
  const { error } = await sb.from('projects').update({ percent_complete: percentComplete }).eq('id', projectId)
  if (error) throw new Error(error.message)
  revalidatePath(`/projects/${projectId}`)
  revalidatePath('/')
}

// --- Tradies ---
export async function createTradie(formData: FormData) {
  const sb = createClient()
  const statesStr = formData.get('states') as string
  const states = statesStr ? statesStr.split(',').map(s => s.trim()).filter(Boolean) : []
  const { error } = await sb.from('tradies').insert({
    business_name: formData.get('businessName'),
    trade_type: formData.get('tradeType'),
    contact_name: formData.get('contactName') || '',
    phone: formData.get('phone') || '',
    email: formData.get('email') || '',
    abn: formData.get('abn') || null,
    licence_number: formData.get('licenceNumber') || null,
    licence_expiry: formData.get('licenceExpiry') || null,
    insurance_expiry: formData.get('insuranceExpiry') || null,
    rating: parseInt(formData.get('rating') as string) || 3,
    notes: formData.get('notes') || '',
    states,
    status: formData.get('status') || 'Available',
  })
  if (error) throw new Error(error.message)
  revalidatePath('/tradies')
}

// --- Work Orders ---
export async function createWorkOrder(formData: FormData) {
  const sb = createClient()
  const quotedPriceStr = formData.get('quotedPrice') as string
  const quotedPriceCents = Math.round(parseFloat(quotedPriceStr.replace(/[^0-9.]/g, '')) * 100)
  const { error } = await sb.from('work_orders').insert({
    project_id: formData.get('projectId'),
    tradie_id: formData.get('tradieId'),
    scope: formData.get('scope'),
    quoted_price: quotedPriceCents,
    start_date: formData.get('startDate'),
    duration: parseInt(formData.get('duration') as string) || 1,
    status: 'Invited',
    notes: formData.get('notes') || '',
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/projects/${formData.get('projectId')}`)
  revalidatePath('/work-orders')
}

// --- Diary Entries ---
export async function createDiaryEntry(formData: FormData) {
  const sb = createClient()
  const { error } = await sb.from('diary_entries').insert({
    project_id: formData.get('projectId'),
    date: formData.get('date'),
    weather: formData.get('weather'),
    work_completed: formData.get('workCompleted') || '',
    delays: formData.get('delays') || '',
    visitors: formData.get('visitors') || '',
    has_issues: formData.get('hasIssues') === 'true',
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/projects/${formData.get('projectId')}`)
  revalidatePath('/diary')
}

// --- Payment Claims ---
export async function createPaymentClaim(formData: FormData) {
  const sb = createClient()
  const amountStr = formData.get('amount') as string
  const amountCents = Math.round(parseFloat(amountStr.replace(/[^0-9.]/g, '')) * 100)
  const projectId = formData.get('projectId') as string
  // Get next claim number
  const { data: existing } = await sb
    .from('payment_claims')
    .select('claim_number')
    .eq('project_id', projectId)
    .order('claim_number', { ascending: false })
    .limit(1)
  const nextClaimNumber = existing && existing.length > 0 ? (existing[0].claim_number as number) + 1 : 1
  const { error } = await sb.from('payment_claims').insert({
    project_id: projectId,
    claim_number: nextClaimNumber,
    claim_date: formData.get('claimDate'),
    claim_period: formData.get('claimPeriod'),
    amount: amountCents,
    retention_pct: parseFloat(formData.get('retentionPct') as string) || 5,
    status: 'Claimed',
    due_date: formData.get('dueDate'),
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/projects/${projectId}`)
  revalidatePath('/claims')
}

// --- Project Files ---
export async function saveFileMetadata({
  projectId, folder, filename, r2Key, fileSize, contentType,
}: {
  projectId: string; folder: string; filename: string
  r2Key: string; fileSize: number; contentType: string
}) {
  const sb = createClient()
  const { error } = await sb.from('project_files').insert({
    project_id: projectId, folder, filename, r2_key: r2Key,
    file_size: fileSize, content_type: contentType,
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/projects/${projectId}`)
}

export async function deleteProjectFile(fileId: string, projectId: string) {
  const sb = createClient()
  const { error } = await sb.from('project_files').delete().eq('id', fileId)
  if (error) throw new Error(error.message)
  revalidatePath(`/projects/${projectId}`)
}
