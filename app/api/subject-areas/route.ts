    import { createSupabaseServer } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createSupabaseServer()

    const { data: subjectAreas, error } = await supabase
      .from("subject_areas")
      .select("*")
      .order("name")

    if (error) {
      console.error(error)
      return new NextResponse("Internal Server Error", { status: 500 })
    }

    return NextResponse.json(subjectAreas)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer()


    const { name, description } = await request.json()

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    const { data, error } = await supabase
      .from("subject_areas")
      .insert([{ name, description }])
      .select()
      .single()

    if (error) {
      console.error(error)
      return new NextResponse("Internal Server Error", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 