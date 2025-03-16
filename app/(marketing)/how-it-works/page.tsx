"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useRef, useState } from "react"
import { Chrome, UserCircle2, KeyRound, LineChart, Database, Brain, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { StepVisuals, type StepTitle } from "@/components/landing/step-visuals"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

interface Step {
  title: StepTitle
  description: string
  icon: typeof Chrome
  color: string
  details: string[]
}

const steps: Step[] = [
  {
    title: "Download & Setup",
    description: "Start by downloading the NEST Chrome extension. It's your first step towards secure online examinations.",
    icon: Chrome,
    color: "bg-blue-500/10 text-blue-500",
    details: [
      "Install NEST extension from Chrome Web Store",
      "Simple one-click setup process",
      "Lightweight and secure monitoring"
    ]
  },
  {
    title: "Account Creation",
    description: "Both administrators and students create their NEST accounts for a seamless experience.",
    icon: UserCircle2,
    color: "bg-purple-500/10 text-purple-500",
    details: [
      "Secure authentication system",
      "Role-based access control",
      "Quick registration process"
    ]
  },
  {
    title: "Test Configuration",
    description: "Administrators generate unique test IDs that students use to join examination sessions.",
    icon: KeyRound,
    color: "bg-indigo-500/10 text-indigo-500",
    details: [
      "Generate unique test identifiers",
      "Share with students securely",
      "Set exam parameters and duration"
    ]
  },
  {
    title: "Real-time Monitoring",
    description: "The extension monitors student activity and sends data securely to our backend.",
    icon: LineChart,
    color: "bg-green-500/10 text-green-500",
    details: [
      "Track mouse movements and keystrokes",
      "Monitor window focus and switches",
      "Privacy-first approach to data collection"
    ]
  },
  {
    title: "Data Processing",
    description: "All collected data is securely stored in Supabase and processed for analysis.",
    icon: Database,
    color: "bg-yellow-500/10 text-yellow-500",
    details: [
      "Secure data storage in Supabase",
      "Real-time data synchronization",
      "Encrypted data transmission"
    ]
  },
  {
    title: "AI Analysis",
    description: "Our ML service analyzes behavior patterns every 30 seconds to detect suspicious activity.",
    icon: Brain,
    color: "bg-red-500/10 text-red-500",
    details: [
      "Advanced feature engineering",
      "Random Forest classification",
      "Real-time risk score calculation"
    ]
  },
  {
    title: "Admin Dashboard",
    description: "Monitor multiple students in real-time with comprehensive analytics and activity logs.",
    icon: LayoutDashboard,
    color: "bg-teal-500/10 text-teal-500",
    details: [
      "Live student activity monitoring",
      "Interactive charts and graphs",
      "Detailed event timeline"
    ]
  }
]

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const springProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div ref={containerRef} className="relative bg-black/95">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--gradient-start)_0%,var(--gradient-end)_100%)]"
          style={{
            "--gradient-start": `rgba(0, 198, 255, 0.15)`,
            "--gradient-end": `rgba(0, 114, 255, 0.05)`,
          } as any}
        />
        <motion.div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, rgba(255,0,128,0.08), transparent 70%)",
            top: useTransform(springProgress, [0, 1], ["0%", "100%"]),
          }}
        />
      </div>

      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-50"
        style={{ scaleX: springProgress }}
      />

      {/* Hero section */}
      <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto relative"
        >
          <motion.div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full"
            style={{
              background: "radial-gradient(circle at center, rgba(0,198,255,0.2), transparent 70%)",
              filter: "blur(40px)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative z-10">
            How NEST Works
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground/90 mb-16 relative z-10">
            Discover how we're revolutionizing online examination monitoring
          </p>
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="cursor-pointer relative z-10"
            onClick={() => {
              containerRef.current?.children[1]?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full border-neutral-800 bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all duration-300"
            >
              <ArrowDown className="w-6 h-6" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Enhanced decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 -left-12 w-64 h-64 rounded-full bg-blue-500/10 blur-[100px]"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-12 w-72 h-72 rounded-full bg-purple-500/10 blur-[100px]"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      {/* Main content */}
      <section className="relative">
        {/* Steps */}
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={index} className="min-h-screen flex items-center justify-center p-8">
              <div className="max-w-6xl w-full mx-auto grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col gap-8"
                >
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-20 h-20 rounded-2xl flex items-center justify-center relative group",
                      step.color,
                      "transition-all duration-300 hover:scale-110"
                    )}>
                      <Icon className="w-10 h-10" />
                      <motion.div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at center, ${step.color.includes('blue') ? 'rgba(0,198,255,0.2)' : 'rgba(255,0,128,0.2)'}, transparent 70%)`,
                          filter: "blur(10px)",
                        }}
                      />
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                      {step.title}
                    </h2>
                  </div>
                  <p className="text-xl text-muted-foreground/90 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-4">
                    {step.details.map((detail, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="flex items-center gap-4 text-lg"
                      >
                        <div className={cn(
                          "w-2.5 h-2.5 rounded-full",
                          step.color.split(" ")[1],
                          "transition-all duration-300 group-hover:scale-125"
                        )} />
                        <span className="text-muted-foreground/90">{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Visual */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative aspect-square w-full max-w-2xl mx-auto"
                >
                  <div className={cn(
                    "absolute inset-0 rounded-3xl",
                    step.color.split(" ")[0],
                    "opacity-20 blur-3xl"
                  )} />
                  <div className="absolute inset-0 rounded-3xl border border-neutral-800/50 bg-black/50 backdrop-blur-xl p-12 hover:border-neutral-700/50 transition-colors duration-300">
                    {StepVisuals[step.title]?.()}
                  </div>
                </motion.div>
              </div>
            </div>
          )
        })}
      </section>

      {/* Enhanced navigation dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.button
            key={i}
            className={cn(
              "size-3 rounded-full transition-all duration-300",
              Math.floor(scrollYProgress.get() * 7) === i
                ? "bg-gradient-to-r from-blue-500 to-purple-500 scale-125"
                : "bg-neutral-700 hover:bg-blue-500/50"
            )}
            onClick={() => {
              const section = containerRef.current?.children[i + 1]
              section?.scrollIntoView({ behavior: "smooth" })
            }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Enhanced floating helper */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-xl rounded-full px-8 py-4 shadow-lg border border-neutral-800 z-50 hover:border-neutral-700 transition-colors duration-300"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.p
          className="text-sm text-muted-foreground/90"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Scroll to explore each step
        </motion.p>
      </motion.div>
    </div>
  )
} 