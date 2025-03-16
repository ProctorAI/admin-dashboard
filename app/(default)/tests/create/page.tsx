"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Minus, Loader2, Save, BookOpen, Clock, Trophy, Calendar, Sparkles, HelpCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useSubjectAreas } from "@/hooks/use-subject-areas"

interface QuestionOption {
  text: string
  is_correct: boolean
}

interface Question {
  text: string
  type: "multiple_choice" | "true_false"
  correct_answer: string
  explanation: string
  marks: number
  order_number: number
  options: QuestionOption[]
}

interface FormData {
  title: string
  description: string
  subject_area_id: string
  duration_minutes: number
  passing_score: number
  is_pro: boolean
  status: "draft" | "published" | "archived"
  start_date: string
  end_date: string
}

export default function CreateTestPage() {
  const router = useRouter()
  const { subjectAreas, isLoading: isLoadingSubjects } = useSubjectAreas()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    subject_area_id: "",
    duration_minutes: 60,
    passing_score: 70,
    is_pro: false,
    status: "draft",
    start_date: "",
    end_date: "",
  })

  const [questions, setQuestions] = useState<Question[]>([
    {
      text: "",
      type: "multiple_choice",
      correct_answer: "",
      explanation: "",
      marks: 1,
      order_number: 1,
      options: [
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ]
    }
  ])

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        type: "multiple_choice",
        correct_answer: "",
        explanation: "",
        marks: 1,
        order_number: questions.length + 1,
        options: [
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
        ]
      }
    ])
  }

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index)
    // Update order numbers
    newQuestions.forEach((q, i) => {
      q.order_number = i + 1
    })
    setQuestions(newQuestions)
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions]
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value
    }
    setQuestions(newQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, field: keyof QuestionOption, value: any) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options[optionIndex] = {
      ...newQuestions[questionIndex].options[optionIndex],
      [field]: value
    }
    setQuestions(newQuestions)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          total_questions: questions.length,
          questions: questions.map(q => ({
            ...q,
            correct_answer: q.type === "multiple_choice" 
              ? q.options.find(o => o.is_correct)?.text || ""
              : q.correct_answer
          }))
        })
      })

      if (!response.ok) {
        throw new Error("Failed to create test")
      }

      toast.success("Test created successfully")
      router.push("/tests")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  }

  if (isLoadingSubjects) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-12 mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        <motion.div 
          className="space-y-2"
          {...fadeInUp}
        >
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Create New Test
          </h1>
          <p className="text-muted-foreground text-lg">
            Design your perfect assessment by filling out the details below.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Test Details */}
          <motion.div 
            className="space-y-6 rounded-xl border bg-card p-8"
            {...fadeInUp}
          >
            <div className="flex items-center gap-3 border-b pb-5">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold tracking-tight">Test Details</h2>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-base">Title</Label>
                <Input
                  id="title"
                  required
                  className="text-lg"
                  placeholder="Enter a descriptive title for your test"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-base">Description</Label>
                <Textarea
                  id="description"
                  className="min-h-[100px] text-base"
                  placeholder="Provide a detailed description of what this test covers..."
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject" className="text-base">Subject Area</Label>
                <Select
                  value={formData.subject_area_id}
                  onValueChange={value => setFormData({ ...formData, subject_area_id: value })}
                >
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="Select a subject area" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectAreas?.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="duration" className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min={1}
                    required
                    className="text-base"
                    value={formData.duration_minutes}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="passing_score" className="text-base flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Passing Score (%)
                  </Label>
                  <Input
                    id="passing_score"
                    type="number"
                    min={0}
                    max={100}
                    required
                    className="text-base"
                    value={formData.passing_score}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, passing_score: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="start_date" className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Start Date
                  </Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    className="text-base"
                    value={formData.start_date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end_date" className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    End Date
                  </Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    className="text-base"
                    value={formData.end_date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <Switch
                  checked={formData.is_pro}
                  onCheckedChange={checked => setFormData({ ...formData, is_pro: checked })}
                />
                <Label className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  Pro Test
                </Label>
              </div>
            </div>
          </motion.div>

          {/* Questions */}
          <motion.div 
            className="space-y-6"
            {...fadeInUp}
          >
            <div className="flex items-center justify-between border-b pb-5">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold tracking-tight">Questions</h2>
              </div>
              <Button 
                type="button" 
                onClick={addQuestion} 
                variant="outline" 
                size="sm"
                className="gap-2 transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>

            <div className="grid gap-6">
              {questions.map((question, questionIndex) => (
                <motion.div
                  key={questionIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: questionIndex * 0.1 }}
                  className="group relative p-8 border rounded-xl bg-card space-y-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-medium flex items-center gap-2">
                      <span className="text-primary">Q{questionIndex + 1}</span>
                      <span className="text-muted-foreground">•</span>
                      <span>{question.type === "multiple_choice" ? "Multiple Choice" : "True/False"}</span>
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(questionIndex)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Minus className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Question Text</Label>
                      <Textarea
                        value={question.text}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateQuestion(questionIndex, "text", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Question Type</Label>
                      <Select
                        value={question.type}
                        onValueChange={value => updateQuestion(questionIndex, "type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                          <SelectItem value="true_false">True/False</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {question.type === "multiple_choice" ? (
                      <div className="grid gap-4">
                        <Label>Options</Label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-4">
                            <Input
                              value={option.text}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOption(questionIndex, optionIndex, "text", e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                              required
                            />
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={option.is_correct}
                                onCheckedChange={checked => updateOption(questionIndex, optionIndex, "is_correct", checked)}
                              />
                              <Label>Correct</Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <Label>Correct Answer</Label>
                        <Select
                          value={question.correct_answer}
                          onValueChange={value => updateQuestion(questionIndex, "correct_answer", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select correct answer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">True</SelectItem>
                            <SelectItem value="false">False</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="grid gap-2">
                      <Label>Explanation</Label>
                      <Textarea
                        value={question.explanation}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateQuestion(questionIndex, "explanation", e.target.value)}
                        placeholder="Explain the correct answer..."
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Marks</Label>
                      <Input
                        type="number"
                        min={1}
                        value={question.marks}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuestion(questionIndex, "marks", parseInt(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="flex justify-end gap-4 pt-4"
            {...fadeInUp}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[150px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Test
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  )
} 