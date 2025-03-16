import { createSupabaseServer } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServer()
    const { searchParams } = new URL(request.url)
    const subject_area_id = searchParams.get("subject_area_id")
    const status = searchParams.get("status")



    let query = supabase
      .from("tests")
      .select(`
        *,
        questions:questions(
          *,
          options:question_options(*)
        )
      `)
      .order("created_at", { ascending: false })

    if (subject_area_id) {
      query = query.eq("subject_area_id", subject_area_id)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data: tests, error } = await query

    if (error) {
      console.error(error)
      return new NextResponse("Internal Server Error", { status: 500 })
    }

    return NextResponse.json(tests)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer()

    const { data: session } = await supabase.auth.getSession()
    if (!session.session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const {
      title,
      description,
      subject_area_id,
      duration_minutes,
      passing_score,
      is_pro,
      status,
      start_date,
      end_date,
      questions,
    } = await request.json()

    // Validate required fields
    if (!title || !subject_area_id || !duration_minutes || !passing_score) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Start a transaction
    const { data: test, error: testError } = await supabase
      .from("tests")
      .insert([
        {
          title,
          description,
          subject_area_id,
          duration_minutes,
          passing_score,
          is_pro,
          status,
          start_date,
          end_date,
          total_questions: questions.length,
          created_by: session.session.user.id,
        },
      ])
      .select()
      .single()

    if (testError) {
      console.error(testError)
      return new NextResponse("Failed to create test", { status: 500 })
    }

    // Insert questions
    for (const [index, question] of questions.entries()) {
      const { data: testQuestion, error: questionError } = await supabase
        .from("questions")
        .insert([
          {
            test_id: test.id,
            question_text: question.text,
            question_type: question.type,
            correct_answer: question.correct_answer,
            explanation: question.explanation,
            marks: question.marks,
            order_number: index + 1,
          },
        ])
        .select()
        .single()

      if (questionError) {
        console.error(questionError)
        return new NextResponse("Failed to create question", { status: 500 })
      }

      // Insert options for multiple choice questions
      if (question.type === "multiple_choice" && question.options?.length > 0) {
        const { error: optionsError } = await supabase
          .from("question_options")
          .insert(
            question.options.map((option: any, optionIndex: number) => ({
              question_id: testQuestion.id,
              option_text: option.text,
              is_correct: option.is_correct,
              order_number: optionIndex + 1,
            }))
          )

        if (optionsError) {
          console.error(optionsError)
          return new NextResponse("Failed to create options", { status: 500 })
        }
      }
    }

    return NextResponse.json(test)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 