"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import type { Locale } from "@/lib/i18n-config"

interface Partner {
  name: string
  logo: string | null
}

interface AboutPartnersProps {
  lang: Locale
}

export default function AboutPartners({ lang }: AboutPartnersProps) {
  const isRtl = useMemo(() => lang === "ar", [lang])
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Define partnersTitle and partnersSubtitle based on lang
  const partnersTitle = lang === "fr" ? "Nos Partenaires" : lang === "ar" ? "شركاؤنا" : "Our Partners"
  const partnersSubtitle = lang === "fr"
    ? "Découvrez les organisations avec lesquelles nous collaborons"
    : lang === "ar"
    ? "تعرف على المنظمات التي نتعاون معها"
    : "Discover the organizations we collaborate with"

  useEffect(() => {
    async function fetchPartners() {
      try {
        const response = await fetch(`/api/partners?lang=${lang}`, {
          next: { revalidate: 3600 }, // ISR: Revalidate every hour
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch partners: ${response.statusText}`)
        }
        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error("Received invalid data format from API")
        }
        // Log partners for debugging
        console.log("Partners data:", data);
        setPartners(data)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading partners")
        setIsLoading(false)
        console.error(err)
      }
    }

    fetchPartners()
  }, [lang])

  // Skeleton UI for loading state
  const SkeletonCard = () => (
    <div className="h-32 w-full rounded-xl border border-border bg-card p-6 animate-pulse">
      <div className="h-20 w-40 mx-auto bg-gray-200 rounded"></div>
    </div>
  )

  if (error) {
    return <div className="py-24 text-center text-red-500">{error}</div>
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="w-full bg-gray-50 py-24 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className={`mb-4 text-3xl font-bold text-foreground md:text-4xl ${isRtl ? "font-arabic" : ""}`}>
            <span className="relative">
              {partnersTitle}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
          <p className={`text-lg text-muted-foreground ${isRtl ? "font-arabic" : ""}`}>
            {partnersSubtitle}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4"
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : partners.map((partner, index) => (
                <motion.div key={index} variants={item} className="flex items-center justify-center">
                  <div className="group flex h-32 w-full items-center justify-center rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-gold/30 hover:shadow-lg">
                    <Image
                      src={partner.logo && (partner.logo.startsWith("data:image/") || partner.logo.startsWith("http"))
                        ? partner.logo
                        : `/placeholder.svg?height=80&width=160&text=${encodeURIComponent(partner.name)}`}
                      alt={partner.name}
                      width={160}
                      height={80}
                      className="max-h-20 w-auto transition-opacity duration-300 group-hover:opacity-80"
                      onError={(e) => {
                        console.warn(`Invalid logo for partner ${partner.name}: ${partner.logo}`);
                        e.currentTarget.src = `/placeholder.svg?height=80&width=160&text=${encodeURIComponent(partner.name)}`;
                      }}
                    />
                  </div>
                </motion.div>
              ))}
        </motion.div>
      </div>
    </section>
  )
}