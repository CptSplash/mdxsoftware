'use client'

import { useState, useRef, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Folder, Upload, FileText, Image, File, Trash2, Download, Loader2 } from 'lucide-react'
import { saveFileMetadata, deleteProjectFile } from '@/lib/supabase/actions'
import { formatDate } from '@/lib/utils'
import type { ProjectFile } from '@/lib/types'

const FOLDERS = [
  'Drawings — Architectural',
  'Drawings — Structural',
  'Reports',
  'Contracts & Legal',
  'Permits & Approvals',
  'Quotes & Invoices',
  'Site Photos',
  'Correspondence',
  'Handover Docs',
  'Other',
]

function fileIcon(contentType: string) {
  if (contentType.startsWith('image/')) return <Image className="w-4 h-4 text-amber-500" />
  if (contentType === 'application/pdf') return <FileText className="w-4 h-4 text-red-500" />
  return <File className="w-4 h-4 text-slate-400" />
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface Props {
  projectId: string
  initialFiles: ProjectFile[]
}

export function RepositoryTab({ projectId, initialFiles }: Props) {
  const [files, setFiles] = useState<ProjectFile[]>(initialFiles)
  const [activeFolder, setActiveFolder] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = useCallback(async (file: File, folder: string) => {
    setUploading(true)
    setError(null)
    try {
      // 1. Get presigned URL
      const res = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId, folder, filename: file.name, contentType: file.type || 'application/octet-stream',
        }),
      })
      if (!res.ok) throw new Error('Failed to get upload URL')
      const { uploadUrl, key } = await res.json()

      // 2. Upload directly to R2
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      })
      if (!uploadRes.ok) throw new Error('Upload to R2 failed')

      // 3. Save metadata to Supabase
      await saveFileMetadata({
        projectId, folder, filename: file.name,
        r2Key: key, fileSize: file.size, contentType: file.type || 'application/octet-stream',
      })

      // 4. Optimistically add to list
      setFiles(prev => [{
        id: crypto.randomUUID(), projectId, folder, filename: file.name,
        r2Key: key, fileSize: file.size, contentType: file.type,
        createdAt: new Date().toISOString(),
      }, ...prev])
    } catch (e: any) {
      setError(e.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [projectId])

  const handleFiles = useCallback((fileList: FileList, folder: string) => {
    Array.from(fileList).forEach(f => uploadFile(f, folder))
  }, [uploadFile])

  const handleDelete = async (file: ProjectFile) => {
    if (!confirm(`Delete "${file.filename}"?`)) return
    await deleteProjectFile(file.id, projectId)
    setFiles(prev => prev.filter(f => f.id !== file.id))
  }

  const folderFiles = (folder: string) => files.filter(f => f.folder === folder)

  // Folder list view
  if (!activeFolder) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FOLDERS.map(folder => {
            const count = folderFiles(folder).length
            return (
              <Card
                key={folder}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setActiveFolder(folder)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Folder className="w-8 h-8 text-amber-400" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{folder}</p>
                      <p className="text-xs text-gray-400">{count} {count === 1 ? 'file' : 'files'}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline" size="sm"
                    className="gap-1.5 text-xs"
                    onClick={e => {
                      e.stopPropagation()
                      setActiveFolder(folder)
                      setTimeout(() => fileInputRef.current?.click(), 50)
                    }}
                  >
                    <Upload className="w-3 h-3" />
                    Upload
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  // Folder detail view
  const currentFiles = folderFiles(activeFolder)
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setActiveFolder(null)}>
            ← All folders
          </Button>
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-gray-900">{activeFolder}</h3>
            <span className="text-sm text-gray-400">({currentFiles.length} files)</span>
          </div>
        </div>
        <Button
          size="sm" className="gap-1.5"
          style={{ backgroundColor: '#1E3A5F' }}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading…' : 'Upload files'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => {
          e.preventDefault()
          setDragOver(false)
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files, activeFolder)
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Drag files here or <span className="text-[#1E3A5F] font-medium">click to browse</span></p>
        <p className="text-xs text-gray-400 mt-1">PDF, DWG, DXF, JPG, PNG, DOCX, XLSX — up to 500 MB</p>
      </div>

      <input
        ref={fileInputRef} type="file" multiple className="hidden"
        onChange={e => { if (e.target.files) handleFiles(e.target.files, activeFolder) }}
      />

      {/* File list */}
      {currentFiles.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">File</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Size</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Uploaded</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentFiles.map(file => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {fileIcon(file.contentType)}
                        <span className="text-gray-900 font-medium truncate max-w-xs">{file.filename}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">{formatBytes(file.fileSize)}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(file.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <a
                          href={`/api/r2/${file.r2Key}`}
                          download={file.filename}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(file)}
                          className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {currentFiles.length === 0 && !uploading && (
        <p className="text-center text-gray-400 text-sm py-4">No files in this folder yet.</p>
      )}
    </div>
  )
}
