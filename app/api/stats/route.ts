import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get total active exams
    const { data: examData } = await supabase
      .from('proctoring_logs')
      .select('exam_id')
      .gt('created_at', lastWeek.toISOString());
    
    const activeExams = new Set(examData?.map(log => log.exam_id)).size;

    // Get suspicious activity count
    const { count: suspiciousEvents } = await supabase
      .from('proctoring_logs')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'suspicious_activity')
      .gt('created_at', lastWeek.toISOString());

    // Get total candidates
    const { data: userData } = await supabase
      .from('proctoring_logs')
      .select('user_id')
      .gt('created_at', lastWeek.toISOString());
    
    const totalCandidates = new Set(userData?.map(log => log.user_id)).size;

    return NextResponse.json({
      activeExams,
      suspiciousEvents,
      totalCandidates
    });
  } catch (error) {
    console.error("[STATS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 