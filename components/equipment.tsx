"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Tab } from "@headlessui/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import type { Locale } from "@/lib/i18n-config";

interface EquipmentProps {
  lang: Locale;
}

interface Item {
  name: string;
  description: string;
  image: string | null;
  features?: string[];
}

interface Category {
  name: string;
  items: Item[];
}

interface Dictionary {
  title: string;
  subtitle: string;
  categories: Category[];
}

export default function Equipment({ lang }: EquipmentProps) {
  const isRtl = lang === "ar";
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEquipment() {
      try {
        const response = await fetch(`/api/equipment?lang=${lang}`);
        if (!response.ok) {
          throw new Error("Failed to fetch equipment data");
        }
        const data = await response.json();
        console.log("API Response:", data.categories); // Debug log to verify grouping
        setDictionary(data);
      } catch (err) {
        setError("Error loading equipment data");
        console.error(err);
      }
    }

    fetchEquipment();
  }, [lang]);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!dictionary) {
    return (
      <div className="container mx-auto px-4">
        <Skeleton height={40} width={300} className="mb-4 mx-auto" />
        <Skeleton height={20} width={500} className="mb-8 mx-auto" />
        <Skeleton height={40} width={200} className="mb-12 mx-auto" />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="rounded-xl border bg-card shadow-md p-6">
                <Skeleton height={192} className="mb-4" />
                <Skeleton height={30} width={150} />
                <Skeleton height={20} width={200} className="mb-4" />
                <Skeleton count={3} height={20} />
              </div>
            ))}
        </div>
      </div>
    );
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
              {dictionary.title}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
          <p className={`text-lg text-muted-foreground ${isRtl ? "font-arabic" : ""}`}>{dictionary.subtitle}</p>
        </motion.div>

        <div className="mx-auto max-w-6xl">
          <Tab.Group onChange={setSelectedCategory} selectedIndex={selectedCategory}>
            <Tab.List
              className={`mb-12 flex flex-wrap justify-center space-x-2 ${isRtl ? "space-x-reverse" : ""} rounded-xl bg-muted p-1`}
            >
              {dictionary.categories.map((category, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    `rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                      selected
                        ? "bg-white text-gold shadow dark:bg-gray-800"
                        : "text-muted-foreground hover:bg-white/[0.12] hover:text-foreground"
                    } ${isRtl ? "font-arabic" : ""}`
                  }
                >
                  {category.name}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              {dictionary.categories.map((category, categoryIndex) => (
                <Tab.Panel key={categoryIndex}>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {category.items.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: itemIndex * 0.1 }}
                        className={`group overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-300 hover:border-gold/30 hover:shadow-lg ${
                          isRtl ? "font-arabic text-right" : ""
                        }`}
                      >
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={
                              item.image ||
                              `/placeholder.svg?height=192&width=384&text=${encodeURIComponent(
                                item.name
                              )}`
                            }
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="mb-2 text-xl font-bold text-foreground">{item.name}</h3>
                          <p className="mb-4 text-muted-foreground">{item.description}</p>
                          {item.features && item.features.length > 0 && (
                            <div className="mt-4">
                              <h4 className="mb-2 text-sm font-medium text-foreground">
                                {lang === "fr" ? "Caractéristiques" : lang === "ar" ? "الميزات" : "Features"}:
                              </h4>
                              <ul className="space-y-1 text-sm">
                                {item.features.map((feature, featureIndex) => (
                                  <li key={featureIndex} className="flex items-start">
                                    <span className="mr-2 text-gold">•</span>
                                    <span className="text-muted-foreground">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </section>
  );
}