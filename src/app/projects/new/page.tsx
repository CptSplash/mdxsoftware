import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getClients } from '@/lib/supabase/queries'
import { createProject } from '@/lib/supabase/actions'
import { ArrowLeft } from 'lucide-react'

async function createProjectAndRedirect(formData: FormData) {
  'use server'
  await createProject(formData)
  redirect('/projects')
}

export default async function NewProjectPage() {
  const clients = await getClients()

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
        </Link>
        <h2 className="text-xl font-bold text-gray-900">New Project</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <form action={createProjectAndRedirect} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Project Number</label>
                <Input name="projectNumber" placeholder="PRJ-2026-004" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Project Name</label>
                <Input name="name" placeholder="e.g. Kellyville Bathroom Pods" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Project Type</label>
                <Select name="type" required>
                  <option value="">Select type...</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Renovation">Renovation</option>
                  <option value="Fit-out">Fit-out</option>
                  <option value="Pod/Modular">Pod/Modular</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select name="status">
                  <option value="Tender">Tender</option>
                  <option value="Active">Active</option>
                  <option value="Practical Completion">Practical Completion</option>
                  <option value="Defects">Defects</option>
                  <option value="Closed">Closed</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Contract Value ($)</label>
                <Input name="contractValue" type="number" placeholder="1850000" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Contract Type</label>
                <Select name="contractType">
                  <option value="Lump Sum">Lump Sum</option>
                  <option value="Cost-Plus">Cost-Plus</option>
                  <option value="Schedule of Rates">Schedule of Rates</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Start Date</label>
                <Input name="startDate" type="date" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">End Date</label>
                <Input name="endDate" type="date" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Site Address</label>
              <Input name="siteAddress" placeholder="e.g. Lot 42-45 Swift Parrot Close, Kellyville NSW 2155" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Client</label>
                <Select name="clientId" required>
                  <option value="">Select client...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Accent Colour</label>
                <Input name="accentColor" type="color" defaultValue="#1E3A5F" className="h-10 w-20 cursor-pointer" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A5F] min-h-[80px] resize-y"
                placeholder="Project notes..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">Save Project</Button>
              <Link href="/projects">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
