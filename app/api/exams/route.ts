import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import type { ExamData } from '@/types/exam';

export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    
    // Get unique exam IDs from the last 24 hours
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const { data: logs } = await supabase
      .from('proctoring_logs')
      .select('*')
      .gte('created_at', last24Hours.toISOString())
      .order('created_at', { ascending: false });

    if (!logs) {
      return NextResponse.json([]);
    }

    // Group logs by exam_id
    const examGroups = new Map<string, typeof logs>();
    logs.forEach(log => {
      if (!log.exam_id) return;
      const examLogs = examGroups.get(log.exam_id) || [];
      examLogs.push(log);
      examGroups.set(log.exam_id, examLogs);
    });

    // Process each exam's data
    const activeExams: ExamData[] = [];

    for (const [examId, examLogs] of examGroups.entries()) {
      // Get unique users
      const uniqueUsers = new Set(examLogs.map(log => log.user_id).filter(Boolean));
      
      // Get the latest log with risk scores
      const latestLogWithScore = [...examLogs]
        .find(log => log.risk_score !== null);

      // Calculate average risk score from logs with scores
      const logsWithScores = examLogs.filter(log => log.risk_score !== null);
      const averageRiskScore = logsWithScores.length > 0
        ? logsWithScores.reduce((acc, log) => acc + (log.risk_score ?? 0), 0) / logsWithScores.length
        : 0;

      // Sort logs by timestamp
      const sortedLogs = [...examLogs].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      // Process student data with risk scores
      const studentMap = new Map<string, {
        logs: typeof logs,
        latestScore: number | null,
        riskLevel: string | null,
        mouseScore: number | null,
        keyboardScore: number | null,
        windowScore: number | null
      }>();

      // Group logs by student and find their latest scores
      examLogs.forEach(log => {
        if (!log.user_id) return;
        const studentLogs = studentMap.get(log.user_id)?.logs || [];
        studentLogs.push(log);
        
        const existingData = studentMap.get(log.user_id) || {
          logs: [],
          latestScore: null,
          riskLevel: null,
          mouseScore: null,
          keyboardScore: null,
          windowScore: null
        };

        if (log.risk_score !== null) {
          studentMap.set(log.user_id, {
            ...existingData,
            logs: studentLogs,
            latestScore: log.risk_score,
            riskLevel: log.risk_level,
            mouseScore: log.mouse_score,
            keyboardScore: log.keyboard_score,
            windowScore: log.window_score
          });
        } else {
          studentMap.set(log.user_id, {
            ...existingData,
            logs: studentLogs
          });
        }
      });

      const examData: ExamData = {
        id: examId,
        title: "Programming Fundamentals Exam",
        description: "Final examination for the Programming Fundamentals course",
        startTime: sortedLogs[0].created_at,
        endTime: sortedLogs[sortedLogs.length - 1].created_at,
        totalStudents: uniqueUsers.size,
        activeStudents: uniqueUsers.size,
        averageRiskScore,
        riskLevel: latestLogWithScore?.risk_level ?? 'low',
        students: Array.from(studentMap.entries()).map(([userId, data]) => ({
          userId,
          name: `Student ${userId.slice(0, 4)}`,
          email: `student${userId.slice(0, 4)}@example.com`,
          examStartTime: data.logs[0].created_at,
          deviceInfo: `Screen: ${data.logs[0].screen_width}x${data.logs[0].screen_height}, Window: ${data.logs[0].window_width}x${data.logs[0].window_height}, Type: ${data.logs[0].device_type || 'Unknown'}`,
          riskScore: data.latestScore ?? 0,
          riskLevel: data.riskLevel ?? 'low',
          mouseScore: data.mouseScore ?? 0,
          keyboardScore: data.keyboardScore ?? 0,
          windowScore: data.windowScore ?? 0
        }))
      };

      activeExams.push(examData);
    }

    // Set headers to prevent caching
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return NextResponse.json(activeExams, { headers });
  } catch (error) {
    console.error("[EXAMS_LIST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 