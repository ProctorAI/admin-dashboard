"use client"

import { motion } from "framer-motion"
import { Chrome, ArrowRight, MousePointer, Keyboard, MonitorDot, Database, Brain, LayoutDashboard, KeyRound } from "lucide-react"
import { ReactElement } from "react"

export type StepTitle = 
  | "Download & Setup"
  | "Account Creation"
  | "Test Configuration"
  | "Real-time Monitoring"
  | "Data Processing"
  | "AI Analysis"
  | "Admin Dashboard"

export const StepVisuals: Record<StepTitle, () => ReactElement> = {
  "Download & Setup": () => (
    <div className="relative size-full flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <Chrome className="w-24 h-24 text-blue-500" />
        <motion.div
          className="absolute -right-4 -bottom-4 bg-blue-500 text-white rounded-full p-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </div>
  ),

  "Account Creation": () => (
    <div className="relative size-full flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-8 rounded-xl border-2 border-dashed border-purple-500/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            👤
          </motion.div>
        </div>
        <motion.div
          className="h-1 w-12 rounded-full bg-purple-500"
          initial={{ width: 0 }}
          animate={{ width: 48 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        />
      </motion.div>
    </div>
  ),

  "Test Configuration": () => (
    <div className="relative size-full flex items-center justify-center">
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <KeyRound className="w-20 h-20 text-indigo-500" />
          <motion.div
            className="absolute -top-1 -right-1 size-3 rounded-full bg-indigo-500"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-2xl"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          🔑
        </motion.div>
      </motion.div>
    </div>
  ),

  "Real-time Monitoring": () => (
    <div className="relative size-full flex items-center justify-center">
      <div className="relative w-64 h-48 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <MousePointer className="w-6 h-6 text-green-500" />
          </motion.div>
          <motion.div
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Keyboard className="w-8 h-8 text-green-500 ml-8" />
          </motion.div>
          <motion.div
            animate={{
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <MonitorDot className="w-8 h-8 text-green-500 ml-8" />
          </motion.div>
        </div>
      </div>
    </div>
  ),

  "Data Processing": () => (
    <div className="relative size-full flex items-center justify-center">
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Database className="w-20 h-20 text-yellow-500" />
        <motion.div
          className="absolute -top-2 -right-2 size-4 rounded-full bg-yellow-500"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    </div>
  ),

  "AI Analysis": () => (
    <div className="relative size-full flex items-center justify-center">
      <motion.div
        className="relative"
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Brain className="w-24 h-24 text-red-500" />
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="size-full rounded-full border-4 border-red-500/30" />
        </motion.div>
      </motion.div>
    </div>
  ),

  "Admin Dashboard": () => (
    <div className="relative size-full flex items-center justify-center">
      <motion.div
        className="relative w-64 h-48 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 left-0 right-0 h-8 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-4">
          <motion.div
            className="size-2 rounded-full bg-teal-500 mr-2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="h-2 w-16 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="p-4 pt-12 grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  ),
} 