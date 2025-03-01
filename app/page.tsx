import { DocumentComparisonTool } from "@/components/document-comparison-tool"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Document Similarity Analyzer</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload two documents and instantly analyze their semantic similarity using AI-powered embeddings.
          </p>
        </div>

        <DocumentComparisonTool />

        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>Supports PDF, DOCX, and TXT files. All documents are processed securely.</p>
        </div>
      </div>
    </main>
  )
}

