import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { Progress } from '@/components/ui/progress'
import { getProjects, getClients, getAllClaims, getWorkOrders } from '@/lib/supabase/queries'
import { formatAUD, formatDate, daysUntil } from '@/lib/utils'

function getTodayStr() {
  return new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function DashboardPage() {
  const [projects, clients, paymentClaims, workOrders] = await Promise.all([
    getProjects(),
    getClients(),
    getAllClaims(),
    getWorkOrders(),
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
    </div>
  )
}
