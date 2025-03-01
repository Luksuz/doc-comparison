'use client'

import { useState } from 'react'
import { compareDocuments } from '../actions/compareDocuments'

export default function CompareForm() {
  const [result, setResult] = useState<{ similarityScore?: number; error?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      const response = await compareDocuments(formData)
      setResult(response)
    } catch (error) {
      console.error('Error:', error)
      setResult({ error: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Compare Documents</h2>
      
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file1" className="block text-sm font-medium text-gray-700 mb-1">
            First Document
          </label>
          <input
            type="file"
            id="file1"
            name="file1"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            accept=".pdf,.docx,.txt"
            required
          />
        </div>
        
        <div>
          <label htmlFor="file2" className="block text-sm font-medium text-gray-700 mb-1">
            Second Document
          </label>
          <input
            type="file"
            id="file2"
            name="file2"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            accept=".pdf,.docx,.txt"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Comparing...' : 'Compare Documents'}
        </button>
      </form>
      
      {result && (
        <div className="mt-6 p-4 border rounded-md">
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <div>
              <h3 className="font-semibold text-lg mb-2">Similarity Score</h3>
              <p className="text-3xl font-bold text-blue-600">
                {(result.similarityScore! * 100).toFixed(2)}%
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 