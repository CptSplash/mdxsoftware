import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getTradies } from '@/lib/supabase/queries'
import { Plus } from 'lucide-react'
import TradiesTable from './TradiesTable'

export default async function TradiesPage() {
  const tradies = await getTradies()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Tradies</h2>
        <Link href="/tradies/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Tradie
          </Button>
        </Link>
      </div>
      <TradiesTable tradies={tradies} />
    </div>
  )
}
