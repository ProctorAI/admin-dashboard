import { createSupabaseServer } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const { testId } = await params
    const supabase = await createSupabaseServer()



    const { data: test, error } = await supabase
      .from("tests")
      .select(`
        *,
        questions:test_questions(
          *,
          options:question_options(*)
        )
      `)
      .eq("id", testId)
      .single()

    if (error) {
      console.error(error)
      return new NextResponse("Internal Server Error", { status: 500 })
    }

    if (!test) {
      return new NextResponse("Test not found", { status: 404 })
    }

    return NextResponse.json(test)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const { testId } = await params
    const supabase = await createSupabaseServer()

    const { data: session } = await supabase.auth.getSession()
    if (!session.session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.session.user.id)
      .single()

    if (!profile || profile.role !== "admin") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const updates = await request.json()

    const { data: test, error } = await supabase
      .from("tests")
      .update(updates)
      .eq("id", testId)
      .select()
      .single()

    if (error) {
      console.error(error)
      return new NextResponse("Internal Server Error", { status: 500 })
    }

    if (!test) {
      return new NextResponse("Test not found", { status: 404 })
    }

    return NextResponse.json(test)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const { testId } = await params
    const supabase = await createSupabaseServer()

    const { data: session } = await supabase.auth.getSession()
    if (!session.session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.session.user.id)
      .single()

    if (!profile || profile.role !== "admin") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    // Delete test questions and options first (cascade delete will handle this)
    const { error } = await supabase
      .from("tests")
      .delete()
      .eq("id", testId)

    if (error) {
      console.error(error)
      return new NextResponse("Internal Server Error", { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 