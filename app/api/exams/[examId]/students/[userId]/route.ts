import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import type { ActivityEvent, TimeSeriesDataPoint, StudentExamData } from '@/types/exam';

export async function GET(
  request: Request,
  context: { params: { examId: string; userId: string } }
) {
  try {
    const params = await Promise.resolve(context.params);
    const { examId, userId } = params;

    if (!examId || !userId) {
      return new NextResponse("Missing examId or userId", { status: 400 });
    }

    const supabase = await createSupabaseServer();
    
    // Get logs for specific student in this exam
    const { data: logs } = await supabase
      .from('proctoring_logs')
      .select('*')
      .eq('exam_id', examId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (!logs || logs.length === 0) {
      return new NextResponse("Student exam data not found", { status: 404 });
    }

    // Process activities
    const recentActivities: ActivityEvent[] = logs.map(log => ({
      id: log.id,
      timestamp: log.created_at,
      type: log.type,
      data: log.data
    }));

    // Process time series data
    const timeSeriesMap = new Map<string, TimeSeriesDataPoint>();
    
    // Get time range
    const timestamps = logs.map(log => new Date(log.created_at).getTime());
    const latestTime = Math.max(...timestamps);
    const earliestTime = Math.min(...timestamps);
    
    // Create minute-by-minute slots
    let currentTime = new Date(earliestTime);
    const endTime = new Date(latestTime);
    
    while (currentTime <= endTime) {
      const timeKey = `${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
      timeSeriesMap.set(timeKey, {
        hour: currentTime.getHours(),
        minute: currentTime.getMinutes(),
        timestamp: currentTime.toISOString(),
        totalActivity: 0,
        suspiciousEvents: 0,
        riskScore: null,
        mouseScore: null,
        keyboardScore: null,
        windowScore: null
      });
      currentTime = new Date(currentTime.getTime() + 60000); 
    }
    
    // Fill in activity data and risk scores
    logs.forEach(log => {
      const logDate = new Date(log.created_at);
      const timeKey = `${logDate.getHours()}:${logDate.getMinutes().toString().padStart(2, '0')}`;
      const point = timeSeriesMap.get(timeKey);
      
      if (point) {
        point.totalActivity++;
        if (log.type === 'window_state_change' && log.data?.state === 'blurred') {
          point.suspiciousEvents++;
        }
        // Update scores if available
        if (log.risk_score !== null) {
          point.riskScore = log.risk_score;
          point.mouseScore = log.mouse_score;
          point.keyboardScore = log.keyboard_score;
          point.windowScore = log.window_score;
        }
      }
    });

    // Convert time series map to sorted array
    const timeSeriesData = Array.from(timeSeriesMap.values())
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Get the latest log with risk scores
    const latestLogWithScore = [...logs]
      .reverse()
      .find(log => log.risk_score !== null);

    // Use the latest available scores or default to 0
    const riskScore = latestLogWithScore?.risk_score ?? 0;
    const riskLevel = latestLogWithScore?.risk_level ?? 'low';
    const mouseScore = latestLogWithScore?.mouse_score ?? 0;
    const keyboardScore = latestLogWithScore?.keyboard_score ?? 0;
    const windowScore = latestLogWithScore?.window_score ?? 0;

    const studentData: StudentExamData = {
      id: userId,
      candidateInfo: {
        name: "Student " + userId.slice(0, 4),
        email: `student${userId.slice(0, 4)}@example.com`,
        examStartTime: logs[0].created_at,
        deviceInfo: `Screen: ${logs[0].screen_width}x${logs[0].screen_height}, Window: ${logs[0].window_width}x${logs[0].window_height}, Type: ${logs[0].device_type || 'Unknown'}`,
        userId: userId,
        riskScore,
        riskLevel,
        mouseScore,
        keyboardScore,
        windowScore
      },
      riskScore,
      riskLevel,
      mouseScore,
      keyboardScore,
      windowScore,
      recentActivities,
      timeSeriesData
    };

    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return NextResponse.json(studentData, { headers });
  } catch (error) {
    console.error("[STUDENT_EXAM_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 