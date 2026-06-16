'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { StatusBadge } from '@/components/ui/status-badge'
import type { Tradie, TradeType } from '@/lib/types'
import { formatDate, daysUntil } from '@/lib/utils'
import { Search, Star } from 'lucide-react'

const TRADE_TYPES: TradeType[] = ['Concretor', 'Framer', 'Electrician', 'Plumber', 'Tiler', 'Painter', 'Plasterer', 'Renderer', 'Roofer', 'Bricklayer', 'Cabinetmaker', 'Glazier', 'Landscaper', 'Other']

interface Props {
  tradies: Tradie[]
}

export default function TradiesTable({ tradies }: Props) {
  const [search, setSearch] = useState('')
  const [tradeFilter, setTradeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = tradies.filter(t => {
    const matchSearch = !search ||
      t.businessName.toLowerCase().includes(search.toLowerCase()) ||
      t.contactName.toLowerCase().includes(search.toLowerCase())
    const matchTrade = !tradeFilter || t.tradeType === tradeFilter
    const matchStatus = !statusFilter || t.status === statusFilter
    return matchSearch && matchTrade && matchStatus
  })

  const isExpiringSoon = (date: string | undefined) => {
    if (!date) return false
    return daysUntil(date) <= 60
  }

  return (
    <>
      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search tradies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 w-56"
          />
        </div>
        <Select value={tradeFilter} onChange={e => setTradeFilter(e.target.value)} className="w-48">
          <option value="">All Trades</option>
          {TRADE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </Select>
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-40">
          <option value="">All Statuses</option>
          <option>Available</option>
          <option>Busy</option>
          <option>Do Not Use</option>
        </Select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Business Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Trade</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rating</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Lic Expiry</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Insurance Expiry</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(tradie => {
                const licWarn = isExpiringSoon(tradie.licenceExpiry)
                const insWarn = isExpiringSoon(tradie.insuranceExpiry)
                return (
                  <tr key={tradie.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/tradies/${tradie.id}`} className="font-semibold text-[#1E3A5F] hover:underline">
                        {tradie.businessName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{tradie.tradeType}</td>
                    <td className="px-4 py-3 text-gray-700">{tradie.contactName}</td>
                    <td className="px-4 py-3 text-gray-600">{tradie.phone}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < tradie.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm ${licWarn ? 'bg-amber-50' : ''}`}>
                      {tradie.licenceExpiry ? (
                        <span className={licWarn ? 'text-amber-700 font-medium' : 'text-gray-600'}>
                          {formatDate(tradie.licenceExpiry)}
                          {licWarn && ` (${daysUntil(tradie.licenceExpiry)}d)`}
                        </span>
                      ) : '—'}
                    </td>
                    <td className={`px-4 py-3 text-sm ${insWarn ? 'bg-amber-50' : ''}`}>
                      {tradie.insuranceExpiry ? (
                        <span className={insWarn ? 'text-amber-700 font-medium' : 'text-gray-600'}>
                          {formatDate(tradie.insuranceExpiry)}
                          {insWarn && ` (${daysUntil(tradie.insuranceExpiry)}d)`}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={tradie.status} />
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
