import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { embed, cosineSimilarity } from "ai"
import mammoth from "mammoth"
import pdfParse from 'pdf-parse'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file1 = formData.get("file1") as File
    const file2 = formData.get("file2") as File

    if (!file1 || !file2) {
      return NextResponse.json({ error: "Both files are required" }, { status: 400 })
    }

    // Extract text from both documents
    const text1 = await extractText(file1)
    const text2 = await extractText(file2)

    if (!text1 || !text2) {
      return NextResponse.json({ error: "Failed to extract text from one or both documents" }, { status: 400 })
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

    return NextResponse.json({ similarityScore })
  } catch (error) {
    console.error("Error comparing documents:", error)
    return NextResponse.json({ error: "Failed to compare documents" }, { status: 500 })
  }
}

async function extractText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const fileType = file.name.split(".").pop()?.toLowerCase()

  switch (fileType) {
    case "pdf":
      const pdfData = await pdfParse(Buffer.from(buffer))
      return pdfData.text

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

