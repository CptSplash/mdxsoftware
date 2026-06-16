import { getWorkOrders, getProjects, getTradies } from '@/lib/supabase/queries'
import WorkOrdersTable from './WorkOrdersTable'

export default async function WorkOrdersPage() {
  const [workOrders, projects, tradies] = await Promise.all([
    getWorkOrders(),
    getProjects(),
    getTradies(),
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Work Orders</h2>
      </div>
      <WorkOrdersTable workOrders={workOrders} projects={projects} tradies={tradies} />
    </div>
  )
}
