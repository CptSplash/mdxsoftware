'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { Progress } from '@/components/ui/progress'
import type { Project, Client, WorkOrder, PaymentClaim, PrelimLine, DiaryEntry, Tradie, ProjectFile, TaskCard } from '@/lib/types'
import { formatAUD, formatDate, daysUntil } from '@/lib/utils'
import { RepositoryTab } from './RepositoryTab'
import { KanbanBoard } from './KanbanBoard'
import { GanttChart } from './GanttChart'

const WEATHER_EMOJI: Record<string, string> = {
  Sunny: '☀️',
  'Partly Cloudy': '⛅',
  Overcast: '☁️',
  Rain: '🌧️',
  Wind: '💨',
  Extreme: '⚡',
}

interface Props {
  project: Project
  client: Client | null
  workOrders: WorkOrder[]
  claims: PaymentClaim[]
  prelims: PrelimLine[]
  diary: DiaryEntry[]
  tradies: Tradie[]
  projectFiles: ProjectFile[]
  taskCards: TaskCard[]
}

export default function ProjectTabs({ project, client, workOrders, claims, prelims, diary, tradies, projectFiles, taskCards }: Props) {
  const totalClaimed = claims.reduce((s, c) => s + c.amount, 0)
  const totalCommitted = workOrders.reduce((s, wo) => s + wo.quotedPrice, 0)
  const prelimBudget = prelims.reduce((s, p) => s + p.budgeted, 0)
  const prelimActual = prelims.reduce((s, p) => s + p.actual, 0)

  return (
    <Tabs defaultValue="overview">
      <TabsList className="gap-1">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="board">Board</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="prelims">Prelims</TabsTrigger>
        <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
        <TabsTrigger value="claims">Claims</TabsTrigger>
        <TabsTrigger value="diary">Diary</TabsTrigger>
        <TabsTrigger value="repository">Repository</TabsTrigger>
      </TabsList>

      {/* OVERVIEW */}
      <TabsContent value="overview">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Project details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                ['Contract Value', formatAUD(project.contractValue)],
                ['Contract Type', project.contractType],
                ['Start Date', formatDate(project.startDate)],
                ['End Date', formatDate(project.endDate)],
                ['Days Remaining', project.status === 'Tender' ? 'Tender' : `${daysUntil(project.endDate)} days`],
                ['Site Address', project.siteAddress],
                ['% Complete', `${project.percentComplete}%`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-900 text-right max-w-[60%]">{val}</span>
                </div>
              ))}
              <div className="pt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{project.percentComplete}%</span>
                </div>
                <Progress value={project.percentComplete} />
              </div>
              {project.notes && (
                <div className="pt-2">
                  <p className="text-xs text-gray-500 font-medium mb-1">Notes</p>
                  <p className="text-sm text-gray-700">{project.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right column */}
          <div className="space-y-4">
            {/* Client card */}
            {client && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="font-semibold text-gray-900">{client.name}</p>
                  {client.abn && <p className="text-gray-500">ABN: {client.abn}</p>}
                  <p className="text-gray-700">{client.contactPerson}</p>
                  <p className="text-gray-700">{client.phone}</p>
                  <p className="text-[#1E3A5F]">{client.email}</p>
                </CardContent>
              </Card>
            )}

            {/* Financial summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  ['Contract Value', formatAUD(project.contractValue)],
                  ['Total Claimed', formatAUD(totalClaimed)],
                  ['Total Committed (WOs)', formatAUD(totalCommitted)],
                  ['Prelims Budget', formatAUD(prelimBudget)],
                  ['Prelims Actual', formatAUD(prelimActual)],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-gray-900">{val}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      {/* PRELIMS */}
      <TabsContent value="prelims">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Budgeted</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actual</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Variance</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {prelims.map(p => {
                    const variance = p.actual - p.budgeted
                    return (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{p.category}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs">{p.description}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{formatAUD(p.budgeted)}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{formatAUD(p.actual)}</td>
                        <td className={`px-4 py-3 text-right font-medium ${variance > 0 ? 'text-red-600' : variance < 0 ? 'text-green-600' : 'text-gray-500'}`}>
                          {variance === 0 ? '—' : `${variance > 0 ? '+' : ''}${formatAUD(variance)}`}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={p.status} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                    <td colSpan={2} className="px-4 py-3 text-gray-900">Totals</td>
                    <td className="px-4 py-3 text-right text-gray-900">{formatAUD(prelimBudget)}</td>
                    <td className="px-4 py-3 text-right text-gray-900">{formatAUD(prelimActual)}</td>
                    <td className={`px-4 py-3 text-right ${prelimActual - prelimBudget > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatAUD(prelimActual - prelimBudget)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* WORK ORDERS */}
      <TabsContent value="work-orders">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tradie</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Trade</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Scope</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Quoted Price</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Start Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {workOrders.map(wo => {
                    const tradie = tradies.find(t => t.id === wo.tradieId)
                    return (
                      <tr key={wo.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{tradie?.businessName}</td>
                        <td className="px-4 py-3 text-gray-600">{tradie?.tradeType}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs">
                          <p className="truncate" title={wo.scope}>{wo.scope}</p>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatAUD(wo.quotedPrice)}</td>
                        <td className="px-4 py-3 text-gray-600">{formatDate(wo.startDate)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={wo.status} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* CLAIMS */}
      <TabsContent value="claims">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Claim #</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Period</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount ex-GST</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Retention</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Net</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">GST</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total inc GST</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {claims.map(claim => {
                    const retention = Math.round(claim.amount * claim.retentionPct / 100)
                    const net = claim.amount - retention
                    const gst = Math.round(net * 0.1)
                    const total = net + gst
                    return (
                      <tr key={claim.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-center font-mono font-medium text-gray-900">#{claim.claimNumber}</td>
                        <td className="px-4 py-3 text-gray-700">{claim.claimPeriod}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{formatAUD(claim.amount)}</td>
                        <td className="px-4 py-3 text-right text-gray-500">{formatAUD(retention)}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{formatAUD(net)}</td>
                        <td className="px-4 py-3 text-right text-gray-500">{formatAUD(gst)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatAUD(total)}</td>
                        <td className="px-4 py-3 text-gray-600">{formatDate(claim.dueDate)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={claim.status} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* DIARY */}
      <TabsContent value="diary">
        <div className="space-y-3">
          {diary.length === 0 && (
            <p className="text-gray-500 text-sm py-8 text-center">No diary entries yet.</p>
          )}
          {diary.map(entry => (
            <Card key={entry.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="text-center min-w-[64px]">
                    <div className="bg-[#1E3A5F] text-white text-xs font-bold rounded-t px-2 py-0.5">
                      {new Date(entry.date).toLocaleDateString('en-AU', { month: 'short' }).toUpperCase()}
                    </div>
                    <div className="border border-t-0 border-gray-200 rounded-b px-2 py-1">
                      <span className="text-xl font-bold text-gray-900">
                        {new Date(entry.date).getDate()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-lg">{WEATHER_EMOJI[entry.weather]}</span>
                      <span className="text-sm text-gray-500">{entry.weather}</span>
                      {entry.hasIssues && (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">Issues</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-800 font-medium">{entry.workCompleted}</p>
                    {entry.delays && entry.delays !== 'None' && (
                      <p className="text-sm text-red-600 mt-1"><span className="font-medium">Delays: </span>{entry.delays}</p>
                    )}
                    {entry.visitors && entry.visitors !== 'None' && (
                      <p className="text-sm text-gray-500 mt-1"><span className="font-medium">Visitors: </span>{entry.visitors}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* BOARD */}
      <TabsContent value="board">
        <KanbanBoard projectId={project.id} initialCards={taskCards} />
      </TabsContent>

      {/* SCHEDULE */}
      <TabsContent value="schedule">
        <GanttChart projectType={project.type} startDate={project.startDate} />
      </TabsContent>

      {/* REPOSITORY */}
      <TabsContent value="repository">
        <RepositoryTab projectId={project.id} initialFiles={projectFiles} />
      </TabsContent>
    </Tabs>
  )
}
