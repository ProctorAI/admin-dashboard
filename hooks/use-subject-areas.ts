import { useState, useEffect } from "react"

interface SubjectArea {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export function useSubjectAreas() {
  const [subjectAreas, setSubjectAreas] = useState<SubjectArea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSubjectAreas = async () => {
      try {
        const response = await fetch("/api/subject-areas")
        if (!response.ok) {
          throw new Error("Failed to fetch subject areas")
        }
        const data = await response.json()
        setSubjectAreas(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubjectAreas()
  }, [])

  return { subjectAreas, isLoading, error }
} 