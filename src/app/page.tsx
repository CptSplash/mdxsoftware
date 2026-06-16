import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { Progress } from '@/components/ui/progress'
import { getProjects, getClients, getAllClaims, getWorkOrders, getAllTaskCards } from '@/lib/supabase/queries'
import { formatAUD, formatDate, daysUntil } from '@/lib/utils'
import { AvatarGroup } from '@/components/ui/avatar-bubble'

function getTodayStr() {
  return new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function DashboardPage() {
  const [projects, clients, paymentClaims, workOrders, allCards] = await Promise.all([
    getProjects(),
    getClients(),
    getAllClaims(),
    getWorkOrders(),
    getAllTaskCards(),
  ])

  const activeProjects = projects.filter(p => p.status === 'Active')
  const totalContractValue = projects.reduce((sum, p) => sum + p.contractValue, 0)

  const now = Date.now()
  const sevenDays = 7 * 86400000
  const claimsDueThisWeek = paymentClaims.filter(c => {
    const due = new Date(c.dueDate).getTime()
    return due >= now && due <= now + sevenDays && c.status !== 'Paid'
  }).length

  const openWorkOrders = workOrders.filter(
    wo => !['Complete', 'Invoiced', 'Paid'].includes(wo.status)
  ).length

  const stats = [
    { label: 'Active Projects', value: activeProjects.length.toString(), sub: 'Currently on site' },
    { label: 'Total Contract Value', value: formatAUD(totalContractValue), sub: 'All projects' },
    { label: 'Claims Due This Week', value: claimsDueThisWeek.toString(), sub: 'Next 7 days', highlight: claimsDueThisWeek > 0 },
    { label: 'Open Work Orders', value: openWorkOrders.toString(), sub: 'Pending / on site' },
  ]

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Good morning, Ryan
        </h2>
        <p className="text-gray-500 mt-0.5">{getTodayStr()}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label} className={stat.highlight ? 'border-amber-400' : ''}>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.highlight ? 'text-amber-600' : 'text-gray-900'}`}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project grid */}
      <div>
        <h3 className="text-base font-semibold text-gray-700 mb-3">All Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map(project => {
            const client = clients.find(c => c.id === project.clientId)
            const days = daysUntil(project.endDate)
            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                  {/* Accent top border */}
                  <div className="h-1" style={{ backgroundColor: project.accentColor }} />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{project.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{project.projectNumber}</p>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>

                    <p className="text-sm text-gray-500 mb-3">{client?.name}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Contract Value</span>
                        <span className="font-semibold text-gray-900">{formatAUD(project.contractValue)}</span>
                      </div>

                      {project.status !== 'Tender' && (
                        <div>
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{project.percentComplete}%</span>
                          </div>
                          <Progress value={project.percentComplete} />
                        </div>
                      )}

                      <div className="flex justify-between text-xs text-gray-500 pt-1">
                        <span>End: {formatDate(project.endDate)}</span>
                        {project.status === 'Tender' ? (
                          <span className="text-blue-600 font-medium">Tender</span>
                        ) : (
                          <span className={days < 0 ? 'text-red-600 font-medium' : days < 30 ? 'text-amber-600 font-medium' : 'text-gray-500'}>
                            {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d remaining`}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Active Tasks board overview */}
      {allCards.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-700">Active Tasks</h3>
            <div className="flex gap-3 text-xs text-gray-500">
              {(['Backlog','To Do','In Progress','In Review','Done'] as const).map(col => {
                const count = allCards.filter(c => c.columnName === col).length
                const dotColor: Record<string, string> = {
                  'Backlog': '#94A3B8', 'To Do': '#3B82F6',
                  'In Progress': '#F59E0B', 'In Review': '#8B5CF6', 'Done': '#10B981',
                }
                return count > 0 ? (
                  <span key={col} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor[col] }} />
                    {col} <span className="font-semibold text-gray-700">{count}</span>
                  </span>
                ) : null
              })}
            </div>
          </div>

          {/* In Progress strip */}
          {allCards.filter(c => c.columnName === 'In Progress').length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">In Progress</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                {allCards.filter(c => c.columnName === 'In Progress').map(card => {
                  const project = projects.find(p => p.id === card.projectId)
                  const priorityColor: Record<string, string> = {
                    Low: '#94A3B8', Medium: '#3B82F6', High: '#F59E0B', Urgent: '#EF4444'
                  }
                  return (
                    <Link key={card.id} href={`/projects/${card.projectId}?tab=board`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                        <div className="h-0.5" style={{ backgroundColor: priorityColor[card.priority] }} />
                        <CardContent className="p-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{card.title}</p>
                            {project && (
                              <p className="text-xs text-gray-400 truncate">{project.name}</p>
                            )}
                          </div>
                          <AvatarGroup assignees={card.assignees} />
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* In Review strip */}
          {allCards.filter(c => c.columnName === 'In Review').length > 0 && (
            <div className="space-y-2 mt-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">In Review</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                {allCards.filter(c => c.columnName === 'In Review').map(card => {
                  const project = projects.find(p => p.id === card.projectId)
                  return (
                    <Link key={card.id} href={`/projects/${card.projectId}?tab=board`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                        <div className="h-0.5 bg-purple-500" />
                        <CardContent className="p-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{card.title}</p>
                            {project && <p className="text-xs text-gray-400 truncate">{project.name}</p>}
                          </div>
                          <AvatarGroup assignees={card.assignees} />
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
