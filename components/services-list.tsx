"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import type { Locale } from "@/lib/i18n-config";

interface ServicesListProps {
  lang: Locale;
}

interface Service {
  title: string;
  description: string;
  image: string | null;
  features?: string[];
}

interface Dictionary {
  title: string;
  services: Service[];
}

export default function ServicesList({ lang }: ServicesListProps) {
  const isRtl = lang === "ar";
  const [activeService, setActiveService] = useState(0);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch(`/api/services?lang=${lang}`);
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setDictionary(data);
      } catch (err) {
        setError("Error loading services");
        console.error(err);
      }
    }

    fetchServices();
  }, [lang]);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!dictionary) {
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="w-full bg-background py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className={`text-3xl font-bold text-foreground md:text-4xl ${isRtl ? "font-arabic" : ""}`}>
            <span className="relative">
              {dictionary.title}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-3">
          {/* Services navigation */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col space-y-2 lg:col-span-1"
          >
            {dictionary.services.map((service, index) => (
              <motion.button
                key={index}
                variants={item}
                className={`group flex items-center rounded-xl border p-4 text-left transition-all duration-300 ${
                  activeService === index
                    ? "border-gold/30 bg-gold/5 shadow-lg"
                    : "border-border bg-card hover:border-gold/20 hover:bg-gold/5"
                } ${isRtl ? "font-arabic text-right" : ""}`}
                onClick={() => setActiveService(index)}
              >
                <div
                  className={`mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                    activeService === index
                      ? "bg-gold text-white"
                      : "bg-muted text-muted-foreground group-hover:bg-gold/20"
                  } ${isRtl ? "ml-4 mr-0" : ""}`}
                >
                  {index + 1}
                </div>
                <h3 className="text-lg font-medium text-foreground">{service.title}</h3>
              </motion.button>
            ))}
          </motion.div>

          {/* Service details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            key={activeService}
            className="lg:col-span-2"
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <div className="relative h-64 w-full sm:h-80">
                <Image
                  src={
                    dictionary.services[activeService].image ||
                    `/placeholder.svg?height=400&width=800&text=${encodeURIComponent(
                      dictionary.services[activeService].title
                    )}`
                  }
                  alt={dictionary.services[activeService].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <h3 className={`text-2xl font-bold text-white ${isRtl ? "font-arabic" : ""}`}>
                    {dictionary.services[activeService].title}
                  </h3>
                </div>
              </div>

              <div className={`p-6 ${isRtl ? "font-arabic text-right" : ""}`}>
                <p className="mb-6 text-lg text-muted-foreground">{dictionary.services[activeService].description}</p>

                {dictionary.services[activeService].features &&
                  dictionary.services[activeService].features.length > 0 && (
                    <div className="mt-6">
                      <h4 className="mb-4 text-lg font-medium text-foreground">
                        {lang === "fr" ? "Caractéristiques" : lang === "ar" ? "الميزات" : "Features"}:
                      </h4>
                      <ul className="space-y-2">
                        {dictionary.services[activeService].features?.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className={`text-gold ${isRtl ? "ml-2 mr-0" : "mr-2"}`}>✓</span>
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                <div className="mt-8"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}