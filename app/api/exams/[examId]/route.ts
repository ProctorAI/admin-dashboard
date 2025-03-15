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
          windowScore: null,
          mouseMovements: 0,
          keystrokes: 0,
          windowSwitches: 0,
          focusTime: 0
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
          switch (log.type) {
            case 'mouse_move':
              point.mouseMovements++;
              break;
            case 'key_press':
              point.keystrokes++;
              break;
            case 'window_state_change':
              point.windowSwitches++;
              if (log.data?.state === 'blurred') {
                point.suspiciousEvents++;
              } else if (log.data?.state === 'focused') {
                point.focusTime += 60;
              }
              break;
          }
          if (log.risk_score !== null) {
            point.riskScore = log.risk_score;
            point.mouseScore = log.mouse_score;
            point.keyboardScore = log.keyboard_score;
            point.windowScore = log.window_score;
          }
        }
      });

      // Calculate activity stats
      const totalTimeInMinutes = (new Date(latestTime).getTime() - new Date(earliestTime).getTime()) / (1000 * 60);
      const focusedLogs = chronologicalLogs.filter(log => 
        log.type === 'window_state_change' && log.data?.state === 'focused'
      );
      const totalFocusTimeInMinutes = focusedLogs.length; // Each focus log represents roughly a minute of focus time
      
      const activityStats = {
        totalEvents: chronologicalLogs.length,
        mouseEvents: chronologicalLogs.filter(log => log.type === 'mouse_move').length,
        keyboardEvents: chronologicalLogs.filter(log => log.type === 'key_press').length,
        windowEvents: chronologicalLogs.filter(log => log.type === 'window_state_change').length,
        suspiciousEventCount: chronologicalLogs.filter(log => 
          log.type === 'window_state_change' && log.data?.state === 'blurred'
        ).length,
        averageRiskScore: chronologicalLogs
          .filter(log => log.risk_score !== null)
          .reduce((acc, log) => acc + (log.risk_score || 0), 0) / chronologicalLogs.length || 0,
        windowSwitchFrequency: chronologicalLogs.filter(log => log.type === 'window_state_change').length / totalTimeInMinutes,
        keystrokeFrequency: chronologicalLogs.filter(log => log.type === 'key_press').length / totalTimeInMinutes,
        mouseMovementFrequency: chronologicalLogs.filter(log => log.type === 'mouse_move').length / totalTimeInMinutes,
        suspiciousEventFrequency: chronologicalLogs.filter(log => 
          log.type === 'window_state_change' && log.data?.state === 'blurred'
        ).length / totalTimeInMinutes,
        focusPercentage: (totalFocusTimeInMinutes / totalTimeInMinutes) * 100
      };

      // Calculate activity breakdown
      const recentLogs = chronologicalLogs.slice(-100);
      const previousLogs = chronologicalLogs.slice(-200, -100);

      const calculateEventCount = (logs: typeof chronologicalLogs, type: string) => 
        logs.filter(log => log.type === type).length;

      const activityBreakdown = {
        data: {
          mouseEvents: calculateEventCount(recentLogs, 'mouse_move'),
          keyboardEvents: calculateEventCount(recentLogs, 'key_press'),
          windowEvents: calculateEventCount(recentLogs, 'window_state_change'),
          otherEvents: calculateEventCount(recentLogs, 'tab_switch')
        },
        trends: {
          mouseEvents: ((calculateEventCount(recentLogs, 'mouse_move') - calculateEventCount(previousLogs, 'mouse_move')) / calculateEventCount(previousLogs, 'mouse_move')) * 100,
          keyboardEvents: ((calculateEventCount(recentLogs, 'key_press') - calculateEventCount(previousLogs, 'key_press')) / calculateEventCount(previousLogs, 'key_press')) * 100,
          windowEvents: ((calculateEventCount(recentLogs, 'window_state_change') - calculateEventCount(previousLogs, 'window_state_change')) / calculateEventCount(previousLogs, 'window_state_change')) * 100,
          otherEvents: ((calculateEventCount(recentLogs, 'tab_switch') - calculateEventCount(previousLogs, 'tab_switch')) / calculateEventCount(previousLogs, 'tab_switch')) * 100,
          overall: ((recentLogs.length - previousLogs.length) / previousLogs.length) * 100
        }
      };

      // Extract device info
      const deviceInfo = {
        screenWidth: chronologicalLogs[0].screen_width,
        screenHeight: chronologicalLogs[0].screen_height,
        windowWidth: chronologicalLogs[0].window_width,
        windowHeight: chronologicalLogs[0].window_height,
        deviceType: chronologicalLogs[0].device_type || 'Unknown',
        userAgent: chronologicalLogs[0].user_agent || 'Unknown'
      };

      // Calculate risk score history
      const riskScoreHistory = chronologicalLogs
        .filter(log => log.risk_score !== null)
        .map(log => ({
          timestamp: log.created_at,
          score: log.risk_score || 0,
          level: log.risk_level || 'low',
          mouseScore: log.mouse_score || 0,
          keyboardScore: log.keyboard_score || 0,
          windowScore: log.window_score || 0
        }));

      // Calculate screen size history
      const screenSizeHistory = chronologicalLogs
        .filter(log => log.window_width && log.window_height)
        .map(log => ({
          timestamp: log.created_at,
          windowWidth: log.window_width,
          windowHeight: log.window_height
        }));

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
        timeSeriesData: Array.from(timeSeriesMap.values()),
        activityStats,
        riskScoreHistory,
        activityBreakdown: activityBreakdown.data,
        deviceInfo,
        screenSizeHistory
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