import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import type { ActivityEvent, TimeSeriesDataPoint, StudentExamData, ExamDetailsData, CandidateInfo } from '@/types/exam';

export async function GET(
  request: Request,
  context: { params: Promise<{ examId: string }> }
) {
  const { examId } = await context.params;

  if (!examId) {
    return new NextResponse("Missing examId", { status: 400 });
  }

  try {
    const supabase = await createSupabaseServer();
    
    // Get all logs for this exam
    const { data: logs } = await supabase
      .from('proctoring_logs')
      .select('*')
      .eq('exam_id', examId)
      .order('created_at', { ascending: false });

    if (!logs || logs.length === 0) {
      return new NextResponse("Exam not found", { status: 404 });
    }

    // Group logs by user_id
    const userLogs = new Map<string, typeof logs>();
    logs.forEach(log => {
      if (!log.user_id) return;
      
      const userLogArray = userLogs.get(log.user_id) || [];
      userLogArray.push(log);
      userLogs.set(log.user_id, userLogArray);
    });

    // Process data for each student
    const studentData: StudentExamData[] = [];
    const students: CandidateInfo[] = [];

    for (const [userId, userLogArray] of userLogs.entries()) {
      // Sort logs chronologically
      const chronologicalLogs = [...userLogArray].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      // Process activities
      const recentActivities: ActivityEvent[] = chronologicalLogs.map(log => ({
        id: log.id,
        timestamp: log.created_at,
        type: log.type,
        data: log.data
      }));

      // Process time series data
      const timeSeriesMap = new Map<string, TimeSeriesDataPoint>();
      
      // Get time range
      const timestamps = chronologicalLogs.map(log => new Date(log.created_at).getTime());
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
      chronologicalLogs.forEach(log => {
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
      const latestLogWithScore = [...chronologicalLogs]
        .reverse()
        .find(log => log.risk_score !== null);

      // Use the latest available scores or default to 0
      const riskScore = latestLogWithScore?.risk_score ?? 0;
      const riskLevel = latestLogWithScore?.risk_level ?? 'low';
      const mouseScore = latestLogWithScore?.mouse_score ?? 0;
      const keyboardScore = latestLogWithScore?.keyboard_score ?? 0;
      const windowScore = latestLogWithScore?.window_score ?? 0;

      // Create student info
      const candidateInfo: CandidateInfo = {
        name: "Student " + userId.slice(0, 4),
        email: `student${userId.slice(0, 4)}@example.com`,
        examStartTime: chronologicalLogs[0].created_at,
        deviceInfo: `Screen: ${chronologicalLogs[0].screen_width}x${chronologicalLogs[0].screen_height}, Window: ${chronologicalLogs[0].window_width}x${chronologicalLogs[0].window_height}, Type: ${chronologicalLogs[0].device_type || 'Unknown'}`,
        userId: userId,
        riskScore,
        riskLevel,
        mouseScore,
        keyboardScore,
        windowScore
      };

      students.push(candidateInfo);

      studentData.push({
        id: userId,
        candidateInfo,
        riskScore,
        riskLevel,
        mouseScore,
        keyboardScore,
        windowScore,
        recentActivities,
        timeSeriesData
      });
    }

    // Calculate exam-wide statistics
    const totalStudents = students.length;
    const activeStudents = students.length;
    const averageRiskScore = students.reduce((acc, student) => acc + student.riskScore, 0) / totalStudents;

    // Get the latest exam-wide risk level
    const latestLogWithScore = [...logs]
      .find(log => log.risk_score !== null);
    const examRiskLevel = latestLogWithScore?.risk_level ?? 'low';

    const examDetails: ExamDetailsData = {
      exam: {
        id: examId,
        title: "Programming Fundamentals Exam",
        description: "Final examination for the Programming Fundamentals course",
        startTime: logs[logs.length - 1].created_at,
        endTime: logs[0].created_at,
        totalStudents,
        activeStudents,
        averageRiskScore,
        riskLevel: examRiskLevel,
        students
      },
      studentData
    };

    // Set headers to prevent caching
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return NextResponse.json(examDetails, { headers });
  } catch (error) {
    console.error("[EXAM_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 