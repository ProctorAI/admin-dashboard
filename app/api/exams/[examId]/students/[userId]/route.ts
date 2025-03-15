import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import type { ActivityEvent, TimeSeriesDataPoint, StudentExamData, ActivityStats, DeviceInfo } from '@/types/exam';

export async function GET(
  request: Request,
  context: { params: Promise<{ examId: string; userId: string }> }
) {
  try {
    const { examId, userId } = await context.params;

    if (!examId || !userId) {
      return new NextResponse("Missing examId or userId", { status: 400 });
    }

    const supabase = await createSupabaseServer();
    
    // Get logs for specific student in this exam with all columns
    const { data: logs } = await supabase
      .from('proctoring_logs')
      .select('*')
      .eq('exam_id', examId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (!logs || logs.length === 0) {
      return new NextResponse("Student exam data not found", { status: 404 });
    }

    // Get initial device info
    const deviceInfo: DeviceInfo = {
      deviceType: logs[0].device_type,
      screenWidth: logs[0].screen_width,
      screenHeight: logs[0].screen_height,
      windowWidth: logs[0].window_width,
      windowHeight: logs[0].window_height,
    };

    // Track window size changes over time
    const screenSizeHistory = logs
      .filter(log => log.window_width !== null && log.window_height !== null)
      .map(log => ({
        timestamp: log.created_at,
        windowWidth: log.window_width!,
        windowHeight: log.window_height!
      }));

    // Process activities
    const recentActivities: ActivityEvent[] = logs.map(log => ({
      id: log.id,
      timestamp: log.created_at,
      type: log.type,
      data: log.data
    }));

    // Process risk score history with all scores
    const riskScoreHistory = logs
      .filter(log => log.risk_score !== null)
      .map(log => ({
        timestamp: log.created_at,
        score: log.risk_score ?? 0,
        mouseScore: log.mouse_score ?? 0,
        keyboardScore: log.keyboard_score ?? 0,
        windowScore: log.window_score ?? 0
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
        riskScore: 0,
        mouseScore: 0,
        keyboardScore: 0,
        windowScore: 0,
        mouseMovements: 0,
        keystrokes: 0,
        windowSwitches: 0,
        focusTime: 0
      });
      currentTime = new Date(currentTime.getTime() + 60000); 
    }
    
    // Calculate activity stats
    const totalDurationMinutes = (latestTime - earliestTime) / (1000 * 60);
    
    const activityStats: ActivityStats = {
      totalEvents: logs.length,
      suspiciousEventCount: logs.filter(log => 
        log.type === 'window_state_change' && log.data?.state === 'blurred'
      ).length,
      averageRiskScore: logs.reduce((sum, log) => sum + (log.risk_score || 0), 0) / 
        logs.filter(log => log.risk_score !== null).length || 0,
      windowSwitchFrequency: logs.filter(log => log.type === 'window_state_change').length / totalDurationMinutes,
      keystrokeFrequency: logs.filter(log => log.type === 'keyboard_activity').length / totalDurationMinutes,
      mouseMovementFrequency: logs.filter(log => log.type === 'mouse_activity').length / totalDurationMinutes,
      focusPercentage: (logs.filter(log => 
        log.type === 'window_state_change' && log.data?.state === 'focused'
      ).length / logs.length) * 100
    };

    // Calculate activity breakdown
    const activityBreakdown = {
      mouseEvents: logs.filter(log => log.type === 'mouse_activity').length,
      keyboardEvents: logs.filter(log => log.type === 'keyboard_activity').length,
      windowEvents: logs.filter(log => log.type === 'window_state_change').length,
      otherEvents: logs.filter(log => 
        !['mouse_activity', 'keyboard_activity', 'window_state_change'].includes(log.type)
      ).length
    };

    // Fill in activity data and risk scores
    logs.forEach(log => {
      const logDate = new Date(log.created_at);
      const timeKey = `${logDate.getHours()}:${logDate.getMinutes().toString().padStart(2, '0')}`;
      const point = timeSeriesMap.get(timeKey);
      
      if (point) {
        point.totalActivity++;
        // Update all scores, defaulting to previous values if null
        if (log.risk_score !== null) {
          point.riskScore = log.risk_score;
          point.mouseScore = log.mouse_score ?? point.mouseScore;
          point.keyboardScore = log.keyboard_score ?? point.keyboardScore;
          point.windowScore = log.window_score ?? point.windowScore;
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
        deviceInfo: `Screen: ${deviceInfo.screenWidth}x${deviceInfo.screenHeight}, Window: ${deviceInfo.windowWidth}x${deviceInfo.windowHeight}, Type: ${deviceInfo.deviceType || 'Unknown'}`,
        userId: userId,
        riskScore,
        riskLevel,
        mouseScore,
        keyboardScore,
        windowScore
      },
      deviceInfo,
      screenSizeHistory,
      riskScore,
      riskLevel,
      mouseScore,
      keyboardScore,
      windowScore,
      recentActivities,
      timeSeriesData,
      activityStats,
      activityBreakdown,
      riskScoreHistory
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