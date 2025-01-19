'use client'

import { useState, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type FileUploadProps = {
  onUpload: (file: File) => void
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (file) {
      onUpload(file)
      setFile(null)
    }
  }

  return (
    <div className="space-y-4">
      <Input type="file" onChange={handleFileChange} accept="video/*,audio/*,.pdf,.doc,.docx" />
      <Button onClick={handleUpload} disabled={!file}>Upload</Button>
    </div>
  )
}

