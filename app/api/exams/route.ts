import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import type { ExamData } from '@/types/exam';

export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    
    // Get unique exam IDs from the last 24 hours
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    console.log('Fetching active tests...');
    // Get all active tests (either started in last 24 hours or not ended yet)
    const { data: activeTests, error: testsError } = await supabase
      .from('tests')
      .select(`
        id,
        title,
        description,
        start_date,
        end_date
      `)
      .or(`start_date.gte.${last24Hours.toISOString()},end_date.gt.${now.toISOString()}`);

    if (testsError) {
      console.error('Error fetching tests:', testsError);
      return new NextResponse("Error fetching tests", { status: 500 });
    }

    console.log('Active tests found:', activeTests?.length);
    if (!activeTests || activeTests.length === 0) {
      return NextResponse.json([]);
    }

    console.log('Fetching logs for tests...');
    // Get all logs for active tests from the last hour to ensure we only show truly active exams
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    const { data: logs, error: logsError } = await supabase
      .from('proctoring_logs')
      .select('*')
      .in('test_id', activeTests.map(test => test.id))
      .gte('created_at', lastHour.toISOString())
      .order('created_at', { ascending: false });

    if (logsError) {
      console.error('Error fetching logs:', logsError);
      return new NextResponse("Error fetching logs", { status: 500 });
    }

    console.log('Logs found:', logs?.length);
    if (!logs) {
      return NextResponse.json([]);
    }

    // Create a map of test details for quick lookup
    const testDetailsMap = new Map(
      activeTests.map(test => [test.id.toString(), test])
    );

    // Group logs by test_id
    const examGroups = new Map<string, typeof logs>();
    logs.forEach(log => {
      if (!log.test_id) return;
      const examLogs = examGroups.get(log.test_id.toString()) || [];
      examLogs.push(log);
      examGroups.set(log.test_id.toString(), examLogs);
    });

    console.log('Processing exam data...');
    // Process each exam's data
    const activeExams: ExamData[] = [];

    for (const [testId, examLogs] of examGroups.entries()) {
      const testDetails = testDetailsMap.get(testId);
      if (!testDetails) {
        console.log(`No test details found for test ID: ${testId}`);
        continue;
      }

      // Get unique users
      const uniqueUsers = new Set(examLogs.map(log => log.user_id).filter(Boolean));
      
      // Sort logs chronologically
      const sortedLogs = [...examLogs].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      // Calculate risk statistics
      const logsWithScores = examLogs.filter(log => log.risk_score !== null);
      const averageRiskScore = logsWithScores.length > 0
        ? logsWithScores.reduce((acc, log) => acc + (log.risk_score ?? 0), 0) / logsWithScores.length
        : 0;

      // Get the overall exam risk level (most frequent risk level in recent logs)
      const recentLogs = logsWithScores.slice(-20); // Look at last 20 logs with scores
      const riskLevelCounts = recentLogs.reduce((acc, log) => {
        if (log.risk_level) {
          acc[log.risk_level] = (acc[log.risk_level] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const examRiskLevel = Object.entries(riskLevelCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || 'low';

      // Process student data
      const studentMap = new Map<string, {
        logs: typeof logs,
        latestScore: number | null,
        riskLevel: string | null,
        mouseScore: number | null,
        keyboardScore: number | null,
        windowScore: number | null,
        deviceInfo: {
          screenWidth: number | null,
          screenHeight: number | null,
          windowWidth: number | null,
          windowHeight: number | null,
          deviceType: string | null
        }
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
          windowScore: null,
          deviceInfo: {
            screenWidth: null,
            screenHeight: null,
            windowWidth: null,
            windowHeight: null,
            deviceType: null
          }
        };

        // Update device info if available
        if (log.screen_width) existingData.deviceInfo.screenWidth = log.screen_width;
        if (log.screen_height) existingData.deviceInfo.screenHeight = log.screen_height;
        if (log.window_width) existingData.deviceInfo.windowWidth = log.window_width;
        if (log.window_height) existingData.deviceInfo.windowHeight = log.window_height;
        if (log.device_type) existingData.deviceInfo.deviceType = log.device_type;

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
        id: testId,
        title: testDetails.title || 'Untitled Test',
        description: testDetails.description || 'No description available',
        startTime: testDetails.start_date,
        endTime: testDetails.end_date,
        totalStudents: uniqueUsers.size,
        activeStudents: uniqueUsers.size,
        averageRiskScore,
        riskLevel: examRiskLevel,
        students: Array.from(studentMap.entries()).map(([userId, data]) => ({
          userId,
          name: `Student ${userId.slice(0, 4)}`,
          email: `student${userId.slice(0, 4)}@example.com`,
          examStartTime: data.logs[0].created_at,
          deviceInfo: `Screen: ${data.deviceInfo.screenWidth}x${data.deviceInfo.screenHeight}, Window: ${data.deviceInfo.windowWidth}x${data.deviceInfo.windowHeight}, Type: ${data.deviceInfo.deviceType || 'Unknown'}`,
          riskScore: data.latestScore ?? 0,
          riskLevel: data.riskLevel ?? 'low',
          mouseScore: data.mouseScore ?? 0,
          keyboardScore: data.keyboardScore ?? 0,
          windowScore: data.windowScore ?? 0
        }))
      };

      activeExams.push(examData);
    }

    console.log(`Returning ${activeExams.length} active exams`);

    // Sort exams by risk level and average risk score
    activeExams.sort((a: ExamData, b: ExamData) => {
      const riskOrder = { high: 3, medium: 2, low: 1 };
      const aRiskValue = riskOrder[a.riskLevel as keyof typeof riskOrder] || 0;
      const bRiskValue = riskOrder[b.riskLevel as keyof typeof riskOrder] || 0;
      
      if (aRiskValue !== bRiskValue) {
        return bRiskValue - aRiskValue;
      }
      return b.averageRiskScore - a.averageRiskScore;
    });

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