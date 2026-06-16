import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { getTradieById } from '@/lib/supabase/queries'
import { formatDate, daysUntil } from '@/lib/utils'
import { ArrowLeft, Star, AlertTriangle, CheckCircle } from 'lucide-react'

interface Props {
  params: { id: string }
}

export default async function TradieDetailPage({ params }: Props) {
  const tradie = await getTradieById(params.id)
  if (!tradie) notFound()

  const licDays = tradie.licenceExpiry ? daysUntil(tradie.licenceExpiry) : null
  const insDays = tradie.insuranceExpiry ? daysUntil(tradie.insuranceExpiry) : null
  const licWarn = licDays !== null && licDays <= 60
  const insWarn = insDays !== null && insDays <= 60

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/tradies">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Tradies
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">{tradie.businessName}</h2>
            <StatusBadge status={tradie.status} />
          </div>
          <p className="text-sm text-gray-400">{tradie.tradeType} · {tradie.states.join(', ')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tradie Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              ['Business Name', tradie.businessName],
              ['Trade', tradie.tradeType],
              ['Contact Name', tradie.contactName],
              ['Phone', tradie.phone],
              ['Email', tradie.email],
              ['ABN', tradie.abn || '—'],
              ['States', tradie.states.join(', ')],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between py-1 border-b border-gray-50 last:border-0">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900 text-right">{val}</span>
              </div>
            ))}

            {/* Rating */}
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Rating</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < tradie.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
                  />
                ))}
              </div>
            </div>

            {tradie.notes && (
              <div className="pt-2">
                <p className="text-xs text-gray-500 font-medium mb-1">Notes</p>
                <p className="text-gray-700">{tradie.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Licence */}
            <div className={`rounded-lg p-4 border ${licWarn ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {licWarn ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                <span className={`font-semibold text-sm ${licWarn ? 'text-amber-800' : 'text-green-800'}`}>
                  Licence
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Number</span>
                  <span className="font-medium">{tradie.licenceNumber || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expires</span>
                  <span className={`font-medium ${licWarn ? 'text-amber-700' : 'text-gray-900'}`}>
                    {tradie.licenceExpiry ? `${formatDate(tradie.licenceExpiry)} (${licDays}d)` : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Insurance */}
            <div className={`rounded-lg p-4 border ${insWarn ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {insWarn ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                <span className={`font-semibold text-sm ${insWarn ? 'text-amber-800' : 'text-green-800'}`}>
                  Insurance
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Expires</span>
                  <span className={`font-medium ${insWarn ? 'text-amber-700' : 'text-gray-900'}`}>
                    {tradie.insuranceExpiry ? `${formatDate(tradie.insuranceExpiry)} (${insDays}d)` : '—'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
