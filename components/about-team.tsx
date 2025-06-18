"use client"
import Skeleton from "react-loading-skeleton";
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Facebook, Twitter, Linkedin } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"
import Card3D from "./ui/3d-card"
import ScrollReveal from "./ui/scroll-reveal"

interface TeamMember {
  name: string
  role: string
  bio: string
  image: string | null
}

interface AboutTeamProps {
  lang: Locale
}

export default function AboutTeam({ lang }: AboutTeamProps) {
  const isRtl = lang === "ar"
  const [members, setMembers] = useState<TeamMember[]>([])
  const [teamTitle, setTeamTitle] = useState<string>("")
  const [teamSubtitle, setTeamSubtitle] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        const response = await fetch(`/api/team-members?lang=${lang}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch team members: ${response.statusText}`)
        }
        const data = await response.json()
        // Check if data has the expected structure
        if (!data.members || !Array.isArray(data.members)) {
          throw new Error("Received invalid data format from API")
        }
        setMembers(data.members)
        setTeamTitle(data.teamTitle || "Our Team")
        setTeamSubtitle(data.teamSubtitle || "Meet the experts behind our success")
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading team members")
        setIsLoading(false)
        console.error(err)
      }
    }

    fetchTeamMembers()
  }, [lang])

  if (isLoading) {
  return (
      <div className="container mx-auto px-4">
        <Skeleton height={40} width={300} className="mb-16 mx-auto" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-3">
          <div className="flex flex-col space-y-2 lg:col-span-1">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} height={60} />
              ))}
          </div>
          <div className="lg:col-span-2">
            <Skeleton height={320} className="mb-6" />
            <Skeleton height={20} count={3} />
            <Skeleton height={20} width={150} className="mt-6" />
            <Skeleton height={20} count={2} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="py-24 text-center text-red-500">{error}</div>
  }

  return (
    <section className="w-full bg-background py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className={`mb-4 text-3xl font-bold text-foreground md:text-4xl ${isRtl ? "font-arabic" : ""}`}>
            <span className="relative">
              {teamTitle}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
          <p className={`text-lg text-muted-foreground ${isRtl ? "font-arabic" : ""}`}>{teamSubtitle}</p>
        </ScrollReveal>

        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <ScrollReveal key={index} delay={index * 0.1} direction={index % 2 === 0 ? "left" : "right"}>
              <Card3D className="h-full">
                <div className="group overflow-hidden rounded-xl bg-card shadow-lg transition-all duration-300 hover:shadow-xl h-full">
                  <div className="relative h-80 w-full overflow-hidden">
                    <Image
                      src={member.image || `/placeholder.svg?height=320&width=320&text=${member.name}`}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </div>
                  <div className={`p-6 ${isRtl ? "font-arabic text-right" : ""}`}>
                    <h3 className="mb-1 text-xl font-bold text-foreground">{member.name}</h3>
                    <p className="mb-4 text-sm font-medium text-gold">{member.role}</p>
                    <p className="text-muted-foreground">{member.bio}</p>
                  </div>
                </div>
              </Card3D>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}