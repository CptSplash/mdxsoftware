import { NextRequest, NextResponse } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { r2, R2_BUCKET } from '@/lib/r2/client'

export async function GET(
  _req: NextRequest,
  { params }: { params: { key: string[] } }
) {
  try {
    const key = params.key.join('/')
    const { Body, ContentType, ContentLength } = await r2.send(
      new GetObjectCommand({ Bucket: R2_BUCKET, Key: key })
    )
    if (!Body) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const stream = Body.transformToWebStream()
    return new NextResponse(stream, {
      headers: {
        'Content-Type': ContentType || 'application/octet-stream',
        'Content-Length': String(ContentLength || ''),
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
