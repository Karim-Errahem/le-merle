"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import type { Locale } from "@/lib/i18n-config"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  date: string
}

interface BlogContentProps {
  lang: Locale
}

export default function BlogContent({ lang }: BlogContentProps) {
  const isRtl = useMemo(() => lang === "ar", [lang])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Define title and subtitle based on lang
  const title = lang === "fr" ? "Notre Blog" : lang === "ar" ? "مدونتنا" : "Our Blog"
  const subtitle = lang === "fr"
    ? "Découvrez nos dernières actualités et insights"
    : lang === "ar"
    ? "اكتشف آخر أخبارنا ورؤانا"
    : "Discover our latest news and insights"

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const response = await fetch(`/api/blog-posts?lang=${lang}`, {
          next: { revalidate: 3600 }, // ISR: Revalidate every hour
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch blog posts: ${response.statusText}`)
        }
        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error("Received invalid data format from API")
        }
        console.log("Blog posts:", data);
         // Debug log
        setPosts(data)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading blog posts")
        setIsLoading(false)
        console.error(err)
      }
    }

    fetchBlogPosts()
  }, [lang])

  // Skeleton UI for loading state
  const SkeletonCard = () => (
    <div className="rounded-xl border border-gold/20 bg-gray-800 p-6 animate-pulse">
      <div className="h-6 w-3/4 bg-gray-700 mb-4 rounded"></div>
      <div className="h-4 w-full bg-gray-700 mb-2 rounded"></div>
      <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
    </div>
  )

  if (error) {
    return <div className="py-24 text-center text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`mb-16 text-3xl font-bold text-white md:text-4xl ${isRtl ? "font-arabic" : ""}`}
          style={{ display: 'inline-block', position: 'relative' }}
        >
          {title}
          <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
        </motion.h2>
        <p className={`text-lg text-gray-400 ${isRtl ? "font-arabic" : ""}`}>{subtitle}</p>
      </motion.div>

      <section className="w-full rounded-xl bg-gray-900 py-24 text-white">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              : posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/${lang}/blog/post/${post.id}`}
                    className="group relative overflow-hidden rounded-xl border border-gold/20 bg-gray-800 p-6 shadow-lg transition-all duration-300 hover:border-gold/40 hover:shadow-gold/10"
                  >
                    <h3 className="text-xl font-semibold text-gold dark:text-amber-300">{post.title}</h3>
                    <p className="text-gray-400 dark:text-gray-400">{post.excerpt}</p>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </Link>
                ))}
          </div>
        </div>
      </section>
    </div>
  )
}