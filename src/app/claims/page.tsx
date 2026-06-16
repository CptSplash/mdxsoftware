import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { getAllClaims, getProjects } from '@/lib/supabase/queries'
import { formatAUD, formatDate } from '@/lib/utils'

export default async function ClaimsPage() {
  const [paymentClaims, projects] = await Promise.all([getAllClaims(), getProjects()])

  const totalAmount = paymentClaims.reduce((s, c) => s + c.amount, 0)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Payment Claims</h2>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Project</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Claim #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Period</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount ex-GST</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">GST</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total inc GST</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paymentClaims.map(claim => {
                const project = projects.find(p => p.id === claim.projectId)
                const retention = Math.round(claim.amount * claim.retentionPct / 100)
                const net = claim.amount - retention
                const gst = Math.round(net * 0.1)
                const total = net + gst
                return (
                  <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{project?.name}</p>
                      <p className="text-xs text-gray-400">{project?.projectNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-medium text-gray-700">#{claim.claimNumber}</td>
                    <td className="px-4 py-3 text-gray-700">{claim.claimPeriod}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatAUD(claim.amount)}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{formatAUD(gst)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatAUD(total)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(claim.dueDate)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={claim.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                <td colSpan={3} className="px-4 py-3 text-gray-900">Total</td>
                <td className="px-4 py-3 text-right text-gray-900">{formatAUD(totalAmount)}</td>
                <td className="px-4 py-3 text-right text-gray-500">{formatAUD(Math.round(totalAmount * 0.1))}</td>
                <td className="px-4 py-3 text-right text-gray-900">{formatAUD(Math.round(totalAmount * 1.1))}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Claimed', value: formatAUD(totalAmount), color: 'text-gray-900' },
          { label: 'Paid', value: formatAUD(paymentClaims.filter(c => c.status === 'Paid').reduce((s, c) => s + c.amount, 0)), color: 'text-green-700' },
          { label: 'Outstanding', value: formatAUD(paymentClaims.filter(c => c.status !== 'Paid').reduce((s, c) => s + c.amount, 0)), color: 'text-amber-700' },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
