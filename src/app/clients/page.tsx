import { getClients, getProjects } from '@/lib/supabase/queries'
import ClientsTable from './ClientsTable'

export default async function ClientsPage() {
  const [clients, projects] = await Promise.all([getClients(), getProjects()])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Clients</h2>
      </div>
      <ClientsTable clients={clients} projects={projects} />
    </div>
  )
}
