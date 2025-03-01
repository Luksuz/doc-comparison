"use client"

import { useState } from "react"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, FileText, Loader2 } from "lucide-react"
import { compareDocuments } from "@/app/actions/compareDocuments"

export function DocumentComparisonTool() {
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [isComparing, setIsComparing] = useState(false)
  const [similarityScore, setSimilarityScore] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCompare = async () => {
    if (!file1 || !file2) {
      setError("Please upload both documents to compare")
      return
    }

    setError(null)
    setIsComparing(true)
    setSimilarityScore(null)

    try {
      const formData = new FormData()
      formData.append("file1", file1)
      formData.append("file2", file2)

      const response = await compareDocuments(formData)

      if ("error" in response) {
        throw new Error(response.error)
      }

      setSimilarityScore(response.similarityScore)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsComparing(false)
    }
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-medium mb-3">Document 1</h2>
          <FileUploader file={file1} setFile={setFile1} accept=".pdf,.docx,.txt" maxSize={10} />
        </div>
        <div>
          <h2 className="text-lg font-medium mb-3">Document 2</h2>
          <FileUploader file={file2} setFile={setFile2} accept=".pdf,.docx,.txt" maxSize={10} />
        </div>
      </div>

      <div className="flex justify-center mt-8 mb-8">
        <Button onClick={handleCompare} disabled={!file1 || !file2 || isComparing} size="lg" className="px-8">
          {isComparing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Comparing Documents
            </>
          ) : (
            <>
              Compare Documents
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {error && <Card className="p-4 bg-destructive/10 border-destructive text-center mt-4">{error}</Card>}

      {isComparing && (
        <div className="mt-8">
          <p className="text-center mb-2 text-sm text-muted-foreground">Processing documents...</p>
          <Progress value={45} className="h-2" />
        </div>
      )}

      {similarityScore !== null && (
        <Card className="p-8 mt-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Similarity Analysis</h3>
          <div className="flex items-center justify-center gap-4 mt-4">
            <FileText className="h-10 w-10 text-primary" />
            <div className="text-4xl font-bold">{(similarityScore * 100).toFixed(1)}%</div>
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <p className="mt-4 text-muted-foreground">
            {similarityScore > 0.8
              ? "These documents are very similar in content."
              : similarityScore > 0.5
                ? "These documents have moderate similarity."
                : "These documents have low similarity."}
          </p>
        </Card>
      )}
    </div>
  )
}

