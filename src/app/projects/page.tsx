import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { Progress } from '@/components/ui/progress'
import { getProjects, getClients } from '@/lib/supabase/queries'
import { formatAUD, formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'

export default async function ProjectsPage() {
  const [projects, clients] = await Promise.all([getProjects(), getClients()])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Projects</h2>
        <Link href="/projects/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Number</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contract Value</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">% Complete</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map(project => {
                const client = clients.find(c => c.id === project.clientId)
                return (
                  <tr
                    key={project.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link href={`/projects/${project.id}`} className="text-[#1E3A5F] font-mono text-xs font-medium hover:underline">
                        {project.projectNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/projects/${project.id}`} className="font-semibold text-gray-900 hover:text-[#1E3A5F]">
                        {project.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{project.type}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      {formatAUD(project.contractValue)}
                    </td>
                    <td className="px-4 py-3 w-32">
                      <div className="flex items-center gap-2">
                        <Progress value={project.percentComplete} className="flex-1" />
                        <span className="text-xs text-gray-500 w-8 text-right">{project.percentComplete}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(project.endDate)}</td>
                    <td className="px-4 py-3 text-gray-600">{client?.name}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
