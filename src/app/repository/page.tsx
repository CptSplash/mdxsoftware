import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { projects, clients } from '@/lib/mock-data'
import { FolderOpen } from 'lucide-react'

export default function RepositoryPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Repository</h2>
      <p className="text-sm text-gray-500">Select a project to browse its document repository.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map(project => {
          const client = clients.find(c => c.id === project.clientId)
          return (
            <Link key={project.id} href={`/projects/${project.id}?tab=repository`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5 flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: project.accentColor + '20' }}
                  >
                    <FolderOpen className="w-5 h-5" style={{ color: project.accentColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{project.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{project.projectNumber}</p>
                    <p className="text-xs text-gray-500 mt-1">{client?.name}</p>
                    <div className="mt-2">
                      <StatusBadge status={project.status} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
