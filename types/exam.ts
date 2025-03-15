export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: string;
  data: any;
}

export interface TimeSeriesDataPoint {
  hour: number;
  minute: number;
  timestamp: string;
  totalActivity: number;
  suspiciousEvents: number;
  riskScore: number | null;
  mouseScore: number | null;
  keyboardScore: number | null;
  windowScore: number | null;
  mouseMovements: number;
  keystrokes: number;
  windowSwitches: number;
  focusTime: number;
}

export interface CandidateInfo {
  name: string;
  email: string;
  examStartTime: string;
  deviceInfo: string;
  userId: string;
  riskScore: number;
  riskLevel: string;
  mouseScore: number;
  keyboardScore: number;
  windowScore: number;
}

export interface ActivityStats {
  totalEvents: number;
  suspiciousEventCount: number;
  averageRiskScore: number;
  windowSwitchFrequency: number;
  keystrokeFrequency: number;
  mouseMovementFrequency: number;
  focusPercentage: number;
}

export interface DeviceInfo {
  deviceType: string | null;
  screenWidth: number | null;
  screenHeight: number | null;
  windowWidth: number | null;
  windowHeight: number | null;
}

export interface RiskScoreHistory {
  timestamp: string;
  score: number;
  mouseScore: number;
  keyboardScore: number;
  windowScore: number;
}

export interface ActivityBreakdown {
  data: Array<{
    type: string;
    count: number;
  }>;
  trends: {
    mouseEvents: number;
    keyboardEvents: number;
    windowEvents: number;
    otherEvents: number;
    overall: number;
  };
}

export interface StudentExamData {
  id: string;
  candidateInfo: CandidateInfo;
  riskScore: number;
  riskLevel: string;
  mouseScore: number;
  keyboardScore: number;
  windowScore: number;
  recentActivities: ActivityEvent[];
  timeSeriesData: TimeSeriesDataPoint[];
  activityStats: {
    totalEvents: number;
    mouseEvents: number;
    keyboardEvents: number;
    windowEvents: number;
    suspiciousEventCount: number;
    averageRiskScore: number;
    windowSwitchFrequency: number;
    keystrokeFrequency: number;
    mouseMovementFrequency: number;
    suspiciousEventFrequency: number;
    focusPercentage: number;
  };
  riskScoreHistory: {
    timestamp: string;
    score: number;
    level: string;
    mouseScore: number;
    keyboardScore: number;
    windowScore: number;
  }[];
  activityBreakdown: ActivityBreakdown;
  deviceInfo: {
    screenWidth: number | null;
    screenHeight: number | null;
    windowWidth: number | null;
    windowHeight: number | null;
    deviceType: string | null;
    userAgent: string | null;
  };
  screenSizeHistory: {
    timestamp: string;
    windowWidth: number;
    windowHeight: number;
  }[];
}

export interface ExamData {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  totalStudents: number;
  activeStudents: number;
  averageRiskScore: number;
  riskLevel: string;
  students: CandidateInfo[];
}

export interface ExamDetailsData {
  exam: ExamData;
  studentData: StudentExamData[];
}

export interface DashboardStats {
  activeExams: number;
  examTrend: number;
  activeCandidates: number;
  candidateTrend: number;
  averageRiskScore: number;
  riskTrend: number;
  highRiskStudents: number;
  highRiskTrend: number;
  highRiskExams: number;
}

export interface ExamStats {
  activeStudents: number;
  totalStudents: number;
  averageRiskScore: number;
}