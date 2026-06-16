import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createTradie } from '@/lib/supabase/actions'
import { ArrowLeft } from 'lucide-react'

async function createTradieAndRedirect(formData: FormData) {
  'use server'
  await createTradie(formData)
  redirect('/tradies')
}

export default function NewTradiePage() {
  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/tradies">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Back to Tradies
          </Button>
        </Link>
        <h2 className="text-xl font-bold text-gray-900">New Tradie</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tradie Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <form action={createTradieAndRedirect} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Business Name</label>
                <Input name="businessName" placeholder="e.g. Volt Force Electrical" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Trade Type</label>
                <Select name="tradeType" required>
                  <option value="">Select trade...</option>
                  {['Concretor','Framer','Electrician','Plumber','Tiler','Painter','Plasterer','Renderer','Roofer','Bricklayer','Cabinetmaker','Glazier','Landscaper','Other'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Contact Name</label>
                <Input name="contactName" placeholder="e.g. Steve Nguyen" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <Input name="phone" placeholder="0411 882 334" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input name="email" type="email" placeholder="steve@voltforce.com.au" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">ABN</label>
                <Input name="abn" placeholder="74 381 920 445" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Licence Number</label>
                <Input name="licenceNumber" placeholder="EC012834" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Licence Expiry</label>
                <Input name="licenceExpiry" type="date" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Insurance Expiry</label>
                <Input name="insuranceExpiry" type="date" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Rating (1–5)</label>
                <Select name="rating" defaultValue="3">
                  <option value="1">1 — Poor</option>
                  <option value="2">2 — Below Average</option>
                  <option value="3">3 — Average</option>
                  <option value="4">4 — Good</option>
                  <option value="5">5 — Excellent</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">States (comma-separated)</label>
                <Input name="states" placeholder="NSW, VIC, QLD" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select name="status">
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="Do Not Use">Do Not Use</option>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A5F] min-h-[80px] resize-y"
                placeholder="Tradie notes..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">Save Tradie</Button>
              <Link href="/tradies">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
