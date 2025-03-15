import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import type { ActivityEvent, TimeSeriesDataPoint, StudentExamData } from '@/types/exam';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ examId: string; userId: string }> }
) {
  try {
    const { examId, userId } = await params;

    if (!examId || !userId) {
      return new NextResponse("Missing examId or userId", { status: 400 });
    }

    console.log(`Fetching data for student ${userId} in exam ${examId}...`);
    const supabase = await createSupabaseServer();
    
    // Get logs for specific student in this exam
    const { data: logs, error: logsError } = await supabase
      .from('proctoring_logs')
      .select('*')
      .eq('test_id', examId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (logsError) {
      console.error('Error fetching logs:', logsError);
      return new NextResponse("Error fetching logs", { status: 500 });
    }

    if (!logs || logs.length === 0) {
      return new NextResponse("Student exam data not found", { status: 404 });
    }

    console.log(`Found ${logs.length} logs for student`);

    // Extract device info
    const deviceInfo = {
      deviceType: logs[0].device_type || 'Unknown',
      screenWidth: logs[0].screen_width,
      screenHeight: logs[0].screen_height,
      windowWidth: logs[0].window_width,
      windowHeight: logs[0].window_height,
      userAgent: logs[0].user_agent || 'Unknown'
    };

    // Track window size changes over time
    const screenSizeHistory = logs
      .filter(log => log.window_width && log.window_height)
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
        windowScore: null,
        mouseMovements: 0,
        keystrokes: 0,
        windowSwitches: 0,
        focusTime: 0
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
            }
            break;
        }

        if (log.risk_score !== null) {
          point.riskScore = log.risk_score;
          point.mouseScore = log.mouse_score ?? point.mouseScore;
          point.keyboardScore = log.keyboard_score ?? point.keyboardScore;
          point.windowScore = log.window_score ?? point.windowScore;
        }
      }
    });

    // Sort time series data chronologically
    const timeSeriesData = Array.from(timeSeriesMap.values())
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    // Calculate activity stats
    const totalTimeInMinutes = Math.max(1, (latestTime - earliestTime) / (1000 * 60));
    
    const activityStats = {
      totalEvents: logs.length,
      mouseEvents: logs.filter(log => log.type === 'mouse_move').length,
      keyboardEvents: logs.filter(log => log.type === 'key_press').length,
      windowEvents: logs.filter(log => log.type === 'window_state_change').length,
      suspiciousEventCount: logs.filter(log => 
        log.type === 'window_state_change' && log.data?.state === 'blurred'
      ).length,
      averageRiskScore: logs
        .filter(log => log.risk_score !== null)
        .reduce((acc, log) => acc + (log.risk_score || 0), 0) / logs.length || 0,
      windowSwitchFrequency: logs.filter(log => log.type === 'window_state_change').length / totalTimeInMinutes,
      keystrokeFrequency: logs.filter(log => log.type === 'key_press').length / totalTimeInMinutes,
      mouseMovementFrequency: logs.filter(log => log.type === 'mouse_move').length / totalTimeInMinutes,
      suspiciousEventFrequency: logs.filter(log => 
        log.type === 'window_state_change' && log.data?.state === 'blurred'
      ).length / totalTimeInMinutes,
      focusPercentage: (logs.filter(log => 
        log.type === 'window_state_change' && log.data?.state === 'focused'
      ).length / totalTimeInMinutes) * 100
    };

    // Calculate activity breakdown for recent events
    const recentLogs = logs.slice(-100);
    const previousLogs = logs.slice(-200, -100);

    const calculateEventCount = (logs: typeof recentLogs, type: string) => 
      logs.filter(log => log.type === type).length;

    const calculateTrend = (recent: number, previous: number) => {
      if (previous === 0) return 0;
      return ((recent - previous) / previous) * 100;
    };

    // Transform the data into the format expected by the chart
    const activityTypes = [
      { type: 'mouse', eventType: 'mouse_move' },
      { type: 'keyboard', eventType: 'key_press' },
      { type: 'window', eventType: 'window_state_change' },
      { type: 'other', eventType: 'tab_switch' }
    ];

    const activityBreakdown = {
      data: activityTypes.map(({ type, eventType }) => ({
        type,
        count: calculateEventCount(recentLogs, eventType)
      })),
      trends: {
        mouseEvents: calculateTrend(
          calculateEventCount(recentLogs, 'mouse_move'),
          calculateEventCount(previousLogs, 'mouse_move')
        ),
        keyboardEvents: calculateTrend(
          calculateEventCount(recentLogs, 'key_press'),
          calculateEventCount(previousLogs, 'key_press')
        ),
        windowEvents: calculateTrend(
          calculateEventCount(recentLogs, 'window_state_change'),
          calculateEventCount(previousLogs, 'window_state_change')
        ),
        otherEvents: calculateTrend(
          calculateEventCount(recentLogs, 'tab_switch'),
          calculateEventCount(previousLogs, 'tab_switch')
        ),
        overall: calculateTrend(recentLogs.length, previousLogs.length)
      }
    };

    // Process risk score history
    const riskScoreHistory = logs
      .filter(log => log.risk_score !== null)
      .map(log => ({
        timestamp: log.created_at,
        score: log.risk_score || 0,
        level: log.risk_level || 'low',
        mouseScore: log.mouse_score || 0,
        keyboardScore: log.keyboard_score || 0,
        windowScore: log.window_score || 0
      }));

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
        deviceInfo: `Screen: ${deviceInfo.screenWidth}x${deviceInfo.screenHeight}, Window: ${deviceInfo.windowWidth}x${deviceInfo.windowHeight}, Type: ${deviceInfo.deviceType}`,
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

    console.log('Successfully processed student data');

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