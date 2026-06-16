// Run once to create the mdxsoftware bucket: npx tsx src/lib/r2/create-bucket.ts
import { CreateBucketCommand } from '@aws-sdk/client-s3'
import { r2, R2_BUCKET } from './client'

async function main() {
  try {
    await r2.send(new CreateBucketCommand({ Bucket: R2_BUCKET }))
    console.log(`Bucket "${R2_BUCKET}" created.`)
  } catch (e: any) {
    if (e.Code === 'BucketAlreadyExists' || e.Code === 'BucketAlreadyOwnedByYou') {
      console.log(`Bucket "${R2_BUCKET}" already exists.`)
    } else {
      throw e
    }
  }
}

main().catch(console.error)
