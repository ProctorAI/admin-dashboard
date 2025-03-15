import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

interface FeaturesRequest {
  interval_seconds: number;
  window_size_seconds: number;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ examId: string }> }
) {
  try {
    const { examId } = await context.params;
    const body: FeaturesRequest = await request.json();

    if (!examId) {
      return new NextResponse("Missing examId", { status: 400 });
    }

    const supabase = await createSupabaseServer();
    
    // Calculate time window
    const currentTime = new Date();
    const windowStart = new Date(currentTime.getTime() - (body.window_size_seconds * 1000));
    
    // Get logs for the specified time window
    const { data: logs, error } = await supabase
      .from('proctoring_logs')
      .select('*')
      .eq('exam_id', examId)
      .gte('created_at', windowStart.toISOString())
      .lte('created_at', currentTime.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    if (!logs || logs.length === 0) {
      return new NextResponse("No data found for the specified time window", { status: 404 });
    }

    // Process data into intervals
    const features: any[] = [];
    let intervalStart = new Date(windowStart);
    
    while (intervalStart < currentTime) {
      const intervalEnd = new Date(intervalStart.getTime() + (body.interval_seconds * 1000));
      const intervalLogs = logs.filter(log => 
        new Date(log.created_at) >= intervalStart && 
        new Date(log.created_at) < intervalEnd
      );

      // Calculate metrics for this interval
      const mouseEvents = intervalLogs.filter(log => log.type === 'mouse_activity');
      const keyboardEvents = intervalLogs.filter(log => log.type === 'keyboard_activity');
      const windowEvents = intervalLogs.filter(log => log.type === 'window_state_change');

      // Calculate normalized mouse coordinates
      const mouseCoords = mouseEvents.map(event => event.data?.coordinates || { x: 0, y: 0 });
      const normX = mouseCoords.map(coord => coord.x);
      const normY = mouseCoords.map(coord => coord.y);

      features.push({
        interval_start: intervalStart.toISOString(),
        interval_end: intervalEnd.toISOString(),
        avg_norm_x: normX.length ? normX.reduce((a, b) => a + b, 0) / normX.length : 0,
        avg_norm_y: normY.length ? normY.reduce((a, b) => a + b, 0) / normY.length : 0,
        std_norm_x: calculateStdDev(normX),
        std_norm_y: calculateStdDev(normY),
        idle_percentage: calculateIdlePercentage(intervalLogs, body.interval_seconds),
        key_press_rate: keyboardEvents.length / (body.interval_seconds / 60), // per minute
        shortcut_key_ratio: calculateShortcutRatio(keyboardEvents),
        backspace_ratio: calculateBackspaceRatio(keyboardEvents),
        rapid_key_ratio: calculateRapidKeyRatio(keyboardEvents),
        clipboard_operation_rate: calculateClipboardRate(intervalLogs),
        blur_count: windowEvents.filter(e => e.data?.state === 'blurred').length,
        tab_switch_count: windowEvents.filter(e => e.data?.type === 'tab_switch').length,
        total_blur_duration: calculateBlurDuration(windowEvents),
        rapid_switch_count: calculateRapidSwitches(windowEvents),
        suspicious_resize_count: calculateSuspiciousResizes(windowEvents)
      });

      intervalStart = intervalEnd;
    }

    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return NextResponse.json(features, { headers });
  } catch (error) {
    console.error("[EXAM_FEATURES_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Utility functions
function calculateStdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map(value => Math.pow(value - mean, 2));
  return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length);
}

function calculateIdlePercentage(logs: any[], intervalSeconds: number): number {
  const activeEvents = logs.filter(log => 
    log.type === 'mouse_activity' || 
    log.type === 'keyboard_activity'
  ).length;
  return Math.max(0, 100 - (activeEvents / intervalSeconds * 100));
}

function calculateShortcutRatio(keyboardEvents: any[]): number {
  const shortcutEvents = keyboardEvents.filter(e => e.data?.isShortcut).length;
  return keyboardEvents.length ? shortcutEvents / keyboardEvents.length : 0;
}

function calculateBackspaceRatio(keyboardEvents: any[]): number {
  const backspaceEvents = keyboardEvents.filter(e => e.data?.key === 'Backspace').length;
  return keyboardEvents.length ? backspaceEvents / keyboardEvents.length : 0;
}

function calculateRapidKeyRatio(keyboardEvents: any[]): number {
  if (keyboardEvents.length < 2) return 0;
  let rapidCount = 0;
  for (let i = 1; i < keyboardEvents.length; i++) {
    const timeDiff = new Date(keyboardEvents[i].created_at).getTime() - 
                     new Date(keyboardEvents[i-1].created_at).getTime();
    if (timeDiff < 50) { // Less than 50ms between keystrokes
      rapidCount++;
    }
  }
  return rapidCount / keyboardEvents.length;
}

function calculateClipboardRate(logs: any[]): number {
  return logs.filter(log => 
    log.type === 'clipboard_operation'
  ).length;
}

function calculateBlurDuration(windowEvents: any[]): number {
  let totalDuration = 0;
  let blurStart: Date | null = null;

  windowEvents.forEach(event => {
    if (event.data?.state === 'blurred' && !blurStart) {
      blurStart = new Date(event.created_at);
    } else if (event.data?.state === 'focused' && blurStart) {
      totalDuration += new Date(event.created_at).getTime() - blurStart.getTime();
      blurStart = null;
    }
  });

  return totalDuration / 1000; // Convert to seconds
}

function calculateRapidSwitches(windowEvents: any[]): number {
  if (windowEvents.length < 2) return 0;
  let rapidCount = 0;
  for (let i = 1; i < windowEvents.length; i++) {
    const timeDiff = new Date(windowEvents[i].created_at).getTime() - 
                     new Date(windowEvents[i-1].created_at).getTime();
    if (timeDiff < 500) { // Less than 500ms between switches
      rapidCount++;
    }
  }
  return rapidCount;
}

function calculateSuspiciousResizes(windowEvents: any[]): number {
  return windowEvents.filter(event => {
    const data = event.data;
    return data?.type === 'resize' && 
           (data?.width < 800 || data?.height < 600); // Example threshold
  }).length;
} 