'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/ui/status-badge'
import type { Client, Project } from '@/lib/types'
import { Search } from 'lucide-react'

interface Props {
  clients: Client[]
  projects: Project[]
}

export default function ClientsTable({ clients, projects }: Props) {
  const [search, setSearch] = useState('')

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Projects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(client => {
                const clientProjects = projects.filter(p => p.clientId === client.id)
                return (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/clients/${client.id}`} className="font-semibold text-[#1E3A5F] hover:underline">
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={client.clientType} />
                    </td>
                    <td className="px-4 py-3 text-gray-700">{client.contactPerson}</td>
                    <td className="px-4 py-3 text-gray-600">{client.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{client.email}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-xs font-bold">
                        {clientProjects.length}
                      </span>
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
