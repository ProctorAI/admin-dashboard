import axios from 'axios';
import type { DashboardStats, ExamData, StudentExamData, ExamDetailsData } from '@/types/exam';

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
  getExamDetails: async (examId: string): Promise<ExamDetailsData> => {
    const { data } = await apiClient.get<ExamDetailsData>(`/exams/${examId}`);
    return data;
  },

  // get specific student data for an exam
  getStudentExamData: async (examId: string, userId: string): Promise<StudentExamData> => {
    const { data } = await apiClient.get<StudentExamData>(`/exams/${examId}/students/${userId}`);
    return data;
  }
}; 