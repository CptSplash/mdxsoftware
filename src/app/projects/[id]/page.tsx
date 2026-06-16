import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import {
  getProjectById,
  getClientById,
  getWorkOrdersByProject,
  getClaimsByProject,
  getPrelimsByProject,
  getDiaryByProject,
  getTradies,
  getProjectFiles,
  getTaskCardsByProject,
} from '@/lib/supabase/queries'
import { ArrowLeft } from 'lucide-react'
import ProjectTabs from './ProjectTabs'

interface Props {
  params: { id: string }
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProjectById(params.id)
  if (!project) notFound()

  const [client, workOrders, claims, prelims, diary, tradies, projectFiles, taskCards] = await Promise.all([
    getClientById(project.clientId),
    getWorkOrdersByProject(params.id),
    getClaimsByProject(params.id),
    getPrelimsByProject(params.id),
    getDiaryByProject(params.id),
    getTradies(),
    getProjectFiles(params.id),
    getTaskCardsByProject(params.id),
  ])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Projects
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm text-gray-400">{project.projectNumber} · {project.type}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ProjectTabs
        project={project}
        client={client}
        workOrders={workOrders}
        claims={claims}
        prelims={prelims}
        diary={diary}
        tradies={tradies}
        projectFiles={projectFiles}
        taskCards={taskCards}
      />
    </div>
  )
}
