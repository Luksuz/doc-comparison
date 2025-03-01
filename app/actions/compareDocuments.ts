'use server'

import { openai } from "@ai-sdk/openai"
import { embed, cosineSimilarity } from "ai"
import mammoth from "mammoth"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"

export async function compareDocuments(formData: FormData) {
  try {
    const file1 = formData.get("file1") as File
    const file2 = formData.get("file2") as File

    if (!file1 || !file2) {
      return { error: "Both files are required", status: 400 }
    }

    // Extract text from both documents
    const text1 = await extractText(file1)
    const text2 = await extractText(file2)

    if (!text1 || !text2) {
      return { error: "Failed to extract text from one or both documents", status: 400 }
    }

    // Generate embeddings for both texts
    const { embedding: embedding1 } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: text1,
    })

    const { embedding: embedding2 } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: text2,
    })

    // Calculate similarity score using cosine similarity
    const similarityScore = cosineSimilarity(embedding1, embedding2)

    return { similarityScore, status: 200 }
  } catch (error) {
    console.error("Error comparing documents:", error)
    return { error: "Failed to compare documents", status: 500 }
  }
}

async function extractText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const fileType = file.name.split(".").pop()?.toLowerCase()

  switch (fileType) {
    case "pdf":
      try {
        // Create a blob from the buffer
        const blob = new Blob([buffer], { type: 'application/pdf' })
        
        // Use LangChain's PDFLoader
        const loader = new PDFLoader(blob)
        const docs = await loader.load()
        
        // Combine all page content into a single string
        return docs.map(doc => doc.pageContent).join('\n')
      } catch (error) {
        console.error("Error extracting PDF text:", error)
        throw new Error("Failed to extract text from PDF")
      }

    case "docx":
      const docxResult = await mammoth.extractRawText({
        arrayBuffer: buffer,
      })
      return docxResult.value

    case "txt":
      return new TextDecoder().decode(buffer)

    default:
      throw new Error(`Unsupported file type: ${fileType}`)
  }
} 