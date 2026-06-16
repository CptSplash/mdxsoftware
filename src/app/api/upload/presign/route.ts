import { NextRequest, NextResponse } from 'next/server'
import { presignUpload, r2Key } from '@/lib/r2/presign'

export async function POST(req: NextRequest) {
  try {
    const { projectId, folder, filename, contentType } = await req.json()
    if (!projectId || !folder || !filename || !contentType) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    const key = r2Key(projectId, folder, filename)
    const uploadUrl = await presignUpload(key, contentType)
    return NextResponse.json({ uploadUrl, key })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
