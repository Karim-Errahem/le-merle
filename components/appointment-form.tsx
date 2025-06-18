"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react'
import type { Locale } from "@/lib/i18n-config"

interface AppointmentFormProps {
  lang: Locale
}

interface Service {
  id: number
  title_fr: string
  title_en: string
  title_ar: string
}

export default function AppointmentForm({ lang }: AppointmentFormProps) {
  const dictionary = {
    fr: {
      title: "Prendre un rendez-vous",
      subtitle: "Réservez votre rendez-vous en quelques étapes simples.",
      form: {
        nameLabel: "Nom",
        emailLabel: "Email",
        phoneLabel: "Téléphone",
        dateLabel: "Date",
        timeLabel: "Heure",
        serviceLabel: "Service",
        messageLabel: "Message (optionnel)",
        submitButton: "Envoyer",
        successMessage: "Votre rendez-vous a été réservé avec succès !",
        errorMessage: "Une erreur s'est produite. Veuillez réessayer.",
        invalidDateTime: "Veuillez sélectionner une date et une heure valides (lundi-vendredi 8h-17h, samedi 8h-12h).",
        slotTaken: "Cet horaire est déjà réservé. Veuillez choisir un autre.",
        noServices: "Aucun service disponible pour le moment.",
        loadingServices: "Chargement des services...",
      },
    },
    en: {
      title: "Book an Appointment",
      subtitle: "Schedule your appointment in a few simple steps.",
      form: {
        nameLabel: "Name",
        emailLabel: "Email",
        phoneLabel: "Phone",
        dateLabel: "Date",
        timeLabel: "Time",
        serviceLabel: "Service",
        messageLabel: "Message (optional)",
        submitButton: "Submit",
        successMessage: "Your appointment has been booked successfully!",
        errorMessage: "An error occurred. Please try again.",
        invalidDateTime: "Please select a valid date and time (Monday-Friday 8:00-17:00, Saturday 8:00-12:00).",
        slotTaken: "This time slot is already reserved. Please choose another.",
        noServices: "No services available at the moment.",
        loadingServices: "Loading services...",
      },
    },
    ar: {
      title: "حجز موعد",
      subtitle: "قم بجدولة موعدك في خطوات بسيطة.",
      form: {
        nameLabel: "الاسم",
        emailLabel: "البريد الإلكتروني",
        phoneLabel: "الهاتف",
        dateLabel: "التاريخ",
        timeLabel: "الوقت",
        serviceLabel: "الخدمة",
        messageLabel: "رسالة (اختياري)",
        submitButton: "إرسال",
        successMessage: "تم حفظ موعدك بنجاح!",
        errorMessage: "حدث خطأ. يرجى المحاولة مرة أخرى.",
        invalidDateTime: "يرجى اختيار تاريخ ووقت صالحين (الإثنين-الجمعة 8:00-17:00، السبت 8:00-12:00).",
        slotTaken: "هذا الوقت محجوز بالفعل. يرجى اختيار وقت آخر.",
        noServices: "لا توجد خدمات متاحة حاليًا.",
        loadingServices: "جارٍ تحميل الخدمات...",
      },
    },
  }

  const isRtl = lang === "ar"
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    service: "",
    message: "",
  })
  const [services, setServices] = useState<Service[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/appointments");
        const data = await response.json();
        if (data.services) {
          setServices(data.services);
        } else {
          setError(dictionary[lang].form.errorMessage);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(dictionary[lang].form.errorMessage);
      }
    };
    fetchServices();
  }, [lang]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || dictionary[lang].form.errorMessage);
        setIsSubmitting(false);
        return;
      }

      // Reset form and show success message
      setFormState({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        service: "",
        message: "",
      });
      setIsSubmitted(true);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error("Error submitting appointment:", err);
      setError(dictionary[lang].form.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-background py-24">
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
              {dictionary[lang].title}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
          <p className={`text-lg text-muted-foreground ${isRtl ? "font-arabic" : ""}`}>{dictionary[lang].subtitle}</p>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`overflow-hidden rounded-xl border border-border bg-card p-8 shadow-lg ${
              isRtl ? "font-arabic text-right" : ""
            }`}
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-8 text-center dark:bg-green-900/20"
              >
                <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
                <p className="text-lg font-medium text-green-800 dark:text-green-200">
                  {dictionary[lang].form.successMessage}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-200">
                    {error}
                  </div>
                )}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-muted-foreground">
                      {dictionary[lang].form.nameLabel}
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        value={formState.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-muted-foreground">
                      {dictionary[lang].form.emailLabel}
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={formState.email}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-muted-foreground">
                    {dictionary[lang].form.phoneLabel}
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="date" className="mb-2 block text-sm font-medium text-muted-foreground">
                      {dictionary[lang].form.dateLabel}
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input
                        type="date"
                        id="date"
                        value={formState.date}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="time" className="mb-2 block text-sm font-medium text-muted-foreground">
                      {dictionary[lang].form.timeLabel}
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input
                        type="time"
                        id="time"
                        value={formState.time}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="mb-2 block text-sm font-medium text-muted-foreground">
                    {dictionary[lang].form.serviceLabel}
                  </label>
                  <select
                    id="service"
                    value={formState.service}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    required
                    disabled={isSubmitting || services.length === 0}
                  >
                    <option value="" disabled>
                      {services.length === 0 ? dictionary[lang].form.loadingServices : dictionary[lang].form.serviceLabel}
                    </option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {lang === "fr" ? service.title_fr : lang === "en" ? service.title_en : service.title_ar}
                      </option>
                    ))}
                  </select>
                </div>

            

                <button
                  type="submit"
                  disabled={isSubmitting || services.length === 0}
                  className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-gold to-amber-400 px-6 py-3 text-base font-medium text-gray-900 shadow-lg transition-all duration-300 hover:shadow-gold/20 disabled:opacity-70"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {dictionary[lang].form.submitButton}...
                      </>
                    ) : (
                      dictionary[lang].form.submitButton
                    )}
                  </span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}