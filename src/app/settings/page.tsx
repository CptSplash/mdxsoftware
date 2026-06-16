import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Settings</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Company Name</label>
              <Input defaultValue="Modexa Construction Pty Ltd" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">ABN</label>
              <Input defaultValue="52 618 204 033" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <Input defaultValue="Level 2, 88 Pitt Street, Sydney NSW 2000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <Input defaultValue="02 9000 1234" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input defaultValue="admin@modexa.com.au" />
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">User Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <Input defaultValue="Ryan" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <Input defaultValue="Thompson" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input type="email" defaultValue="ryan@modexa.com.au" />
          </div>
          <Separator />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button>Update Account</Button>
        </CardContent>
      </Card>
    </div>
  )
}
