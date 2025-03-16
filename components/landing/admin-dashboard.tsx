import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const features = [
  {
    title: "Real-time Monitoring",
    description: "Track ongoing examinations in real-time with our intuitive dashboard. View active sessions, student status, and potential violations as they happen.",
    image: "/pages/realtime-monitoring.png",
    alt: "Real-time monitoring dashboard",
  },
  {
    title: "Comprehensive Analytics",
    description: "Gain deep insights into examination patterns with detailed analytics. Visualize suspicious activity trends, session durations, and violation types through interactive charts.",
    image: "/pages/analytics-page.png",
    alt: "Analytics dashboard view",
  },
  {
    title: "Session Management",
    description: "Efficiently manage examination sessions with detailed logs and recordings. Review flagged incidents, student behavior patterns, and take immediate action when needed.",
    image: "/pages/session-management.png",
    alt: "Session management interface",
  },
]

export function AdminDashboard() {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Powerful{" "}
          <span className="bg-gradient-to-r from-[#38bdf8] via-[#2dd4bf] to-[#0070F3] bg-clip-text text-transparent">
            Admin Dashboard
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Take control of your online examinations with our feature-rich admin dashboard
        </p>
      </motion.div>

      <div className="mt-16 flex flex-col gap-24">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className={`flex flex-col gap-8 lg:items-center ${
              index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
            }`}
          >
            {/* Text Content */}
            <div className="flex-1 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {feature.title}
                </h3>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                  {feature.description}
                </p>
                <div className="mt-6">
                  <button className="group inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Learn more
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Image */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative rounded-2xl bg-gradient-to-b from-muted/50 to-muted p-2 ring-1 ring-foreground/10 backdrop-blur-3xl dark:from-muted/30 dark:to-background/80"
              >
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  width={600}
                  height={400}
                  quality={100}
                  className="rounded-xl shadow-2xl ring-1 ring-foreground/10 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 opacity-0 transition-opacity duration-300 hover:opacity-100" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
} 