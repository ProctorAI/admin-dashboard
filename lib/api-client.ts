import axios from 'axios';
import type { DashboardStats, ExamData, StudentExamData, ExamDetailsData } from '@/types/exam';

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<DashboardStats>('/stats');
    return data;
  },

  // get list of all exams with summary data
  getExams: async (): Promise<ExamData[]> => {
    const { data } = await apiClient.get<ExamData[]>('/exams');
    return data;
  },

  // get detailed exam data including all students
  getExamDetails: async (testId: string): Promise<ExamDetailsData> => {
    const { data } = await apiClient.get<ExamDetailsData>(`/exams/${testId}`);
    return data;
  },

  // get specific student data for an exam
  getStudentExamData: async (testId: string, userId: string): Promise<StudentExamData> => {
    const { data } = await apiClient.get<StudentExamData>(`/exams/${testId}/students/${userId}`);
    return data;
  },

  getExamFeatures: async (testId: string, intervalSeconds: number, windowSizeSeconds: number) => {
    const response = await fetch(`${API_BASE_URL}/features/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          test_id: testId,
        interval_seconds: intervalSeconds,
        window_size_seconds: windowSizeSeconds
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Return empty features array for 404
        return {
          exam_id: testId,
          intervals_processed: 0,
          features: []
        };
      }
      throw new Error('Failed to fetch exam features');
    }

    return response.json();
  },
}; 