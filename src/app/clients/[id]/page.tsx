import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { getClientById, getProjectsByClient } from '@/lib/supabase/queries'
import { formatAUD, formatDate } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: { id: string }
}

export default async function ClientDetailPage({ params }: Props) {
  const client = await getClientById(params.id)
  if (!client) notFound()

  const clientProjects = await getProjectsByClient(params.id)

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/clients">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Clients
          </Button>
        </Link>
        <h2 className="text-xl font-bold text-gray-900">{client.name}</h2>
        <StatusBadge status={client.clientType} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              ['Business Name', client.name],
              ['ABN', client.abn || '—'],
              ['Contact Person', client.contactPerson],
              ['Phone', client.phone],
              ['Email', client.email],
              ['Address', client.address],
              ['Type', client.clientType],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between py-1 border-b border-gray-50 last:border-0">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900 text-right max-w-[60%]">{val}</span>
              </div>
            ))}
            {client.notes && (
              <div className="pt-2">
                <p className="text-xs text-gray-500 font-medium mb-1">Notes</p>
                <p className="text-gray-700">{client.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Projects ({clientProjects.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {clientProjects.length === 0 && (
              <p className="text-gray-500 text-sm">No projects linked.</p>
            )}
            {clientProjects.map(proj => (
              <Link key={proj.id} href={`/projects/${proj.id}`}>
                <div className="flex items-center justify-between p-3 rounded-md border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{proj.name}</p>
                    <p className="text-xs text-gray-400">{proj.projectNumber} · {formatDate(proj.endDate)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={proj.status} />
                    <span className="text-xs font-semibold text-gray-700">{formatAUD(proj.contractValue)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
