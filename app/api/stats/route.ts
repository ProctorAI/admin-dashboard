import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get current active exams (tests from the last 24 hours)
    const { data: currentExams } = await supabase
      .from('proctoring_logs')
      .select('test_id')
      .gt('created_at', lastWeek.toISOString());
    
    const activeExams = new Set(currentExams?.map(log => log.test_id)).size;

    // Get previous week's exam count for trend
    const { data: previousExams } = await supabase
      .from('proctoring_logs')
      .select('test_id')
      .lt('created_at', lastWeek.toISOString())
      .gt('created_at', lastMonth.toISOString());

    const previousExamCount = new Set(previousExams?.map(log => log.test_id)).size;
    const examTrend = previousExamCount ? ((activeExams - previousExamCount) / previousExamCount) * 100 : 0;

    // Get current active candidates
    const { data: currentUsers } = await supabase
      .from('proctoring_logs')
      .select('user_id')
      .gt('created_at', lastWeek.toISOString());
    
    const activeCandidates = new Set(currentUsers?.map(log => log.user_id)).size;

    // Get previous week's candidate count for trend
    const { data: previousUsers } = await supabase
      .from('proctoring_logs')
      .select('user_id')
      .lt('created_at', lastWeek.toISOString())
      .gt('created_at', lastMonth.toISOString());

    const previousCandidateCount = new Set(previousUsers?.map(log => log.user_id)).size;
    const candidateTrend = previousCandidateCount ? ((activeCandidates - previousCandidateCount) / previousCandidateCount) * 100 : 0;

    // Get current risk statistics
    const { data: riskData } = await supabase
      .from('proctoring_logs')
      .select('risk_score, risk_level, user_id, test_id')
      .not('risk_score', 'is', null)
      .gt('created_at', lastWeek.toISOString())
      .order('created_at', { ascending: false });

    // Calculate average risk score
    const validRiskScores = riskData?.filter(log => log.risk_score !== null) || [];
    const averageRiskScore = validRiskScores.length
      ? validRiskScores.reduce((acc, log) => acc + (log.risk_score || 0), 0) / validRiskScores.length
      : 0;

    // Get previous week's average risk score for trend
    const { data: previousRiskData } = await supabase
      .from('proctoring_logs')
      .select('risk_score')
      .not('risk_score', 'is', null)
      .lt('created_at', lastWeek.toISOString())
      .gt('created_at', lastMonth.toISOString());

    const previousAverageRisk = previousRiskData?.length
      ? previousRiskData.reduce((acc, log) => acc + (log.risk_score || 0), 0) / previousRiskData.length
      : 0;
    const riskTrend = previousAverageRisk ? ((averageRiskScore - previousAverageRisk) / previousAverageRisk) * 100 : 0;

    // Count high risk students and exams
    const highRiskUsers = new Set(
      riskData
        ?.filter(log => log.risk_level === 'high')
        .map(log => log.user_id)
    ).size;

    const highRiskExams = new Set(
      riskData
        ?.filter(log => log.risk_level === 'high')
        .map(log => log.test_id)
    ).size;

    // Get previous week's high risk count for trend
    const { data: previousHighRiskData } = await supabase
      .from('proctoring_logs')
      .select('user_id')
      .eq('risk_level', 'high')
      .lt('created_at', lastWeek.toISOString())
      .gt('created_at', lastMonth.toISOString());

    const previousHighRiskCount = new Set(previousHighRiskData?.map(log => log.user_id)).size;
    const highRiskTrend = previousHighRiskCount ? ((highRiskUsers - previousHighRiskCount) / previousHighRiskCount) * 100 : 0;

    return NextResponse.json({
      activeExams,
      examTrend,
      activeCandidates,
      candidateTrend,
      averageRiskScore,
      riskTrend,
      highRiskStudents: highRiskUsers,
      highRiskTrend,
      highRiskExams
    });
  } catch (error) {
    console.error("[STATS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 