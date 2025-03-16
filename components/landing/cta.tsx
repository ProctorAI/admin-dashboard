"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Sparkles, Bell } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ShimmerButton } from "@/components/magicui/shimmer-button"

export function CTA() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 size-[400px] opacity-30 blur-3xl">
          <div className="aspect-square h-full rounded-full bg-gradient-to-tr from-[#00C6FF]/30 via-[#0072FF]/30 to-[#FF0080]/30" />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Transform Your{" "}
          <span className="bg-gradient-to-r from-[#00C6FF] to-[#0072FF] bg-clip-text text-transparent">
            Online Examinations
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:mt-8">
          Download our Chrome extension to monitor student activity during exams
        </p>
        <div className="mt-8 sm:mt-10 flex justify-center">
          <ShimmerButton 
            className="flex items-center gap-2 px-8 py-4 text-base font-medium sm:text-lg rounded-full"
            background="linear-gradient(to right, #0072FF, #00C6FF)"
          >
            <Link href="/register">
            <span className="whitespace-pre-wrap text-center leading-none tracking-tight text-white">
              Get started today
            </span>
            </Link>
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </ShimmerButton>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative mt-20 sm:mt-24 lg:mt-32"
      >
        <div className="mx-auto max-w-5xl">
          <motion.div 
            className="group relative rounded-3xl bg-white p-2 dark:bg-neutral-900 shadow-[0_0_1px_1px_rgba(0,0,0,0.05)] dark:shadow-[0_0_1px_1px_rgba(255,255,255,0.05)]"
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="absolute inset-0 rounded-3xl bg-neutral-100/50 dark:bg-neutral-800/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            <div className="relative rounded-[1.25rem] border border-neutral-200/50 dark:border-neutral-800/50 bg-white p-8 dark:bg-neutral-900 lg:p-12 overflow-hidden">
              {/* Decorative dots */}
              <div className="absolute right-6 top-6 size-24 opacity-40">
                <div className="absolute size-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <div className="absolute left-4 size-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <div className="absolute left-8 size-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <div className="absolute top-4 size-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <div className="absolute left-4 top-4 size-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <div className="absolute left-8 top-4 size-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <div className="absolute top-8 size-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <div className="absolute left-4 top-8 size-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <div className="absolute left-8 top-8 size-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              </div>

              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <Bell className="size-6 text-blue-500" />
                    <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      Stay Updated
                    </h3>
                  </motion.div>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-lg text-muted-foreground"
                  >
                    Get notified when we release new features and updates
                  </motion.p>
                </div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-full lg:w-auto max-w-md"
                >
                  <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative group/input flex-1">
                      <Input
                        required
                        type="email"
                        placeholder="Enter your email"
                        className={cn(
                          "h-12 rounded-full bg-white dark:bg-neutral-900",
                          "border border-neutral-200 dark:border-neutral-800",
                          "shadow-[0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)]",
                          "focus-visible:ring-2 focus-visible:ring-blue-500/20 dark:focus-visible:ring-blue-500/30",
                          "placeholder:text-neutral-500 dark:placeholder:text-neutral-400",
                          "text-base transition-shadow duration-300"
                        )}
                      />
                      <div className="absolute inset-0 -z-10 rounded-full opacity-0 blur transition-opacity duration-300 group-hover/input:opacity-100 bg-blue-500/10" />
                    </div>
                    <ShimmerButton 
                      className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
                    >
                      <span className="whitespace-pre-wrap text-center leading-none tracking-tight text-white">
                        Subscribe
                      </span>
                    </ShimmerButton>
                  </form>
                  <p className="mt-3 text-sm text-muted-foreground/70">
                    By subscribing you agree with our{" "}
                    <Link href="#" className="text-blue-500 hover:text-blue-400 transition-colors">
                      Privacy Policy
                    </Link>
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
} 