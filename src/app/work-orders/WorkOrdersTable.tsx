'use client'

import { useState } from 'react'
import { Select } from '@/components/ui/select'
import { StatusBadge } from '@/components/ui/status-badge'
import type { WorkOrder, Project, Tradie } from '@/lib/types'
import { formatAUD, formatDate } from '@/lib/utils'

interface Props {
  workOrders: WorkOrder[]
  projects: Project[]
  tradies: Tradie[]
}

export default function WorkOrdersTable({ workOrders, projects, tradies }: Props) {
  const [projectFilter, setProjectFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = workOrders.filter(wo => {
    const matchProject = !projectFilter || wo.projectId === projectFilter
    const matchStatus = !statusFilter || wo.status === statusFilter
    return matchProject && matchStatus
  })

  return (
    <>
      <div className="flex gap-3 flex-wrap">
        <Select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} className="w-64">
          <option value="">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.projectNumber} — {p.name}</option>)}
        </Select>
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-40">
          <option value="">All Statuses</option>
          {['Invited', 'Quoted', 'Accepted', 'On Site', 'Complete', 'Invoiced', 'Paid'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Project</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tradie</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Scope</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Quoted Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Start Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(wo => {
                const project = projects.find(p => p.id === wo.projectId)
                const tradie = tradies.find(t => t.id === wo.tradieId)
                return (
                  <tr key={wo.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{project?.name}</p>
                      <p className="text-xs text-gray-400">{project?.projectNumber}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{tradie?.businessName}</p>
                      <p className="text-xs text-gray-400">{tradie?.tradeType}</p>
                    </td>
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
      </div>
    </>
  )
}
