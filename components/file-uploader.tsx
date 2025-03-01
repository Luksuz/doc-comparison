"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { FileIcon, UploadCloud, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
  file: File | null
  setFile: (file: File | null) => void
  accept: string
  maxSize: number // in MB
}

export function FileUploader({ file, setFile, accept, maxSize }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): boolean => {
    setError(null)

    // Check file type
    const fileType = file.name.split(".").pop()?.toLowerCase()
    const acceptedTypes = accept.split(",").map((type) => type.trim().replace(".", "").toLowerCase())

    if (!fileType || !acceptedTypes.includes(fileType)) {
      setError(`File type not supported. Please upload ${accept.replace(/\./g, "")} files.`)
      return false
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSize}MB.`)
      return false
    }

    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (validateFile(droppedFile)) {
        setFile(droppedFile)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (validateFile(selectedFile)) {
        setFile(selectedFile)
      }
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const getFileTypeIcon = () => {
    if (!file) return null

    const fileType = file.name.split(".").pop()?.toLowerCase()
    return <FileIcon className="h-8 w-8 text-primary" />
  }

  return (
    <div className="w-full">
      {!file ? (
        <Card
          className={`border-2 border-dashed p-8 text-center ${
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          } transition-colors duration-200 cursor-pointer`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium">Drag & drop your file here or click to browse</p>
            <p className="text-sm text-muted-foreground">
              Supports {accept.replace(/\./g, "")} files up to {maxSize}MB
            </p>
          </div>
          <input ref={inputRef} type="file" className="hidden" accept={accept} onChange={handleChange} />
        </Card>
      ) : (
        <Card className="p-4 border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileTypeIcon()}
              <div className="overflow-hidden">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveFile()
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  )
}

