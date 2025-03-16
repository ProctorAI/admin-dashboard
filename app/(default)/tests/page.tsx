"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Search, Filter, MoreVertical, Copy, Check } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useSubjectAreas } from "@/hooks/use-subject-areas"

interface Test {
  id: string
  title: string
  description: string
  subject_area_id: string
  duration_minutes: number
  passing_score: number
  total_questions: number
  is_pro: boolean
  status: "draft" | "published" | "archived"
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

export default function TestsPage() {
  const router = useRouter()
  const { subjectAreas } = useSubjectAreas()
  const [tests, setTests] = useState<Test[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetchTests()
  }, [selectedSubject, selectedStatus])

  const fetchTests = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedSubject !== "all" && selectedSubject) params.append("subject_area_id", selectedSubject)
      if (selectedStatus !== "all" && selectedStatus) params.append("status", selectedStatus)

      const response = await fetch(`/api/tests?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch tests")
      }
      const data = await response.json()
      setTests(data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to load tests")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTests = tests?.filter(test => {
    const matchesSubject = selectedSubject === "all" || test.subject_area_id === selectedSubject
    const matchesStatus = selectedStatus === "all" || test.status === selectedStatus
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSubject && matchesStatus && matchesSearch
  })

  const handleStatusChange = async (testId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tests/${testId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update test status")
      }

      setTests(tests.map(test =>
        test.id === testId ? { ...test, status: newStatus as Test["status"] } : test
      ))

      toast.success("Test status updated")
    } catch (error) {
      console.error(error)
      toast.error("Failed to update test status")
    }
  }

  const handleDelete = async (testId: string) => {
    if (!confirm("Are you sure you want to delete this test?")) {
      return
    }

    try {
      const response = await fetch(`/api/tests/${testId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete test")
      }

      setTests(tests.filter(test => test.id !== testId))
      toast.success("Test deleted")
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete test")
    }
  }

  const copyToClipboard = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
      toast.success("ID copied to clipboard")
    } catch (err) {
      toast.error("Failed to copy ID")
    }
  }

  return (
    <div className="container py-8 mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
            <p className="text-muted-foreground">
              Manage your online tests and assessments.
            </p>
          </div>
          <Button onClick={() => router.push("/tests/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Test
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tests..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjectAreas?.map(subject => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">
                      Loading tests...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredTests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">
                      No tests found. Create your first test to get started.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTests.map(test => (
                  <TableRow key={test.id}>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {test.id.slice(0, 8)}...
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(test.id)}
                        >
                          {copiedId === test.id ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span className="sr-only">Copy ID</span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Link
                          href={`/tests/${test.id}`}
                          className="font-medium hover:underline"
                        >
                          {test.title}
                        </Link>
                        {test.is_pro && (
                          <Badge variant="secondary" className="ml-2">
                            PRO
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {test.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      {subjectAreas?.find(s => s.id === test.subject_area_id)?.name}
                    </TableCell>
                    <TableCell>{test.total_questions}</TableCell>
                    <TableCell>{test.duration_minutes} mins</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          test.status === "published"
                            ? "default"
                            : test.status === "draft"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {test.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(test.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/tests/${test.id}/edit`)}
                          >
                            Edit
                          </DropdownMenuItem>
                          {test.status !== "published" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(test.id, "published")}
                            >
                              Publish
                            </DropdownMenuItem>
                          )}
                          {test.status === "published" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(test.id, "archived")}
                            >
                              Archive
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(test.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  )
} 