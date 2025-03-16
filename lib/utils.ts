import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Chrome, Server, Zap, Database, LayoutDashboard, KeyRound } from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const features = [
  {
    icon: Chrome,
    title: "Browser Extension",
    info: "Secure Chrome extension built with React that tracks and monitors student activity during exams, including mouse movements and keyboard inputs.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Server,
    title: "Real-time Backend",
    info: "Next.js powered backend with FastAPI integration for efficient log processing and real-time monitoring of examination sessions.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Zap,
    title: "AI-Powered Detection",
    info: "Advanced ML models using Python and FastAPI to detect suspicious activities and assign risk scores in real-time.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Database,
    title: "Secure Database",
    info: "Supabase database integration for secure storage of exam logs, user data, and AI predictions with real-time updates.",
    gradient: "from-orange-500 to-yellow-500"
  },
  {
    icon: LayoutDashboard,
    title: "Admin Dashboard",
    info: "Modern Next.js dashboard for administrators to monitor exams, review flagged events, and take immediate action.",
    gradient: "from-red-500 to-rose-500"
  },
  {
    icon: KeyRound,
    title: "Secure Authentication",
    info: "Robust authentication system to ensure only authorized users can access the platform and manage exam sessions.",
    gradient: "from-indigo-500 to-violet-500"
  }
];