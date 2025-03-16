"use client"

import { ArrowRight, ArrowRightIcon, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { BorderBeam } from "@/components/magicui/border-beam"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { AuroraText } from "@/components/magicui/aurora-text"
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text"
import { cn } from "@/lib/utils"

export function Hero() {
  return (
    <section className="py-20 sm:py-24 lg:py-22">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group relative mx-auto flex justify-center"
      >
        <Link
          href="#"
          className="group rounded-full border border-black/5 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-1.5 text-sm text-neutral-700 transition-all ease-in hover:cursor-pointer dark:border-white/5 dark:from-neutral-900 dark:to-neutral-800 dark:text-neutral-300"
        >
          <span className="inline-flex items-center gap-1">
            🚀 Browser Extension Now Available
            <ArrowRightIcon className="size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 text-center"
      >
        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-6xl">
          <span className="inline-block bg-gradient-to-r from-[#00C6FF] to-[#0072FF] bg-clip-text text-transparent">
            NEST
          </span>
          <span className="block text-foreground">
            Non-Invasive Examination{" "}
            <span className="bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#FF0080] bg-clip-text text-transparent">
              Surveillance Technology
            </span>
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          A simple browser extension that helps monitor online exams while keeping student privacy intact.
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-4">
          <ShimmerButton 
            className="flex items-center gap-2 px-8 py-3.5 text-base font-medium sm:text-lg"
            background="linear-gradient(to right, #0072FF, #00C6FF)"
          >
            <span className="whitespace-pre-wrap text-center leading-none tracking-tight text-white">
              Install Extension
            </span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 sm:size-5" />
          </ShimmerButton>
          <ShimmerButton 
            className="flex items-center gap-2 px-8 py-3.5 text-base font-medium sm:text-lg"
            background="linear-gradient(to right, #7928CA, #FF0080)"
          >
            <span className="whitespace-pre-wrap text-center leading-none tracking-tight text-white">
              View Demo
            </span>
          </ShimmerButton>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative mx-auto mt-16 sm:mt-20 lg:mt-14"
      >
        <div className="relative rounded-2xl bg-gradient-to-b from-muted/50 to-muted p-2 ring-1 ring-foreground/10 backdrop-blur-3xl dark:from-muted/30 dark:to-background/80">
          <Image
            src="/pages/realtime-monitoring.png"
            alt="NEST Dashboard"
            width={1200}
            height={1600}
            quality={100}
            priority
            className="rounded-xl shadow-2xl ring-1 ring-foreground/10 transition-all duration-300"
          />
          <BorderBeam size={250} duration={12} delay={9} />
        </div>
      </motion.div>
    </section>
  )
} 