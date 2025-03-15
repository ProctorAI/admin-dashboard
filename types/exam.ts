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
  suspiciousEvents: number;
  totalCandidates: number;
}