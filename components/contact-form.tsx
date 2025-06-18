"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, CheckCircle, AlertCircle } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"

interface ContactFormProps {
 
  lang: Locale
}

export default function ContactForm({  lang }: ContactFormProps) {
   const dictionary = {
    formTitle: lang === "fr" ? "Contactez-nous" : lang === "ar" ? "اتصل بنا" : "Contact Us",
    nameLabel: lang === "fr" ? "Nom" : lang === "ar" ? "الاسم" : "Name",
    emailLabel: lang === "fr" ? "Email" : lang === "ar" ? "البريد الإلكتروني" : "Email",
    telephoneLabel: lang === "fr" ? "Téléphone" : lang === "ar" ? "الهاتف" : "Phone",
    messageLabel: lang === "fr" ? "Message" : lang === "ar" ? "الرسالة" : "Message",
    submitButton: lang === "fr" ? "Envoyer" : lang === "ar" ? "إرسال" : "Send",
    successMessage: lang === "fr"
      ? "Votre message a été envoyé avec succès."
      : lang === "ar"
      ? "تم إرسال رسالتك بنجاح."
      : "Your message was sent successfully.",
    errorMessage: lang === "fr"
      ? "Une erreur s'est produite. Veuillez réessayer."
      : lang === "ar"
      ? "حدث خطأ. حاول مرة أخرى."
      : "An error occurred. Please try again.",
  };

  const isRtl = lang === "ar"
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
      const apiUrl = `${baseUrl}/api/contact`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      })

      if (!response.ok) {
        throw new Error(`Failed to submit form: ${response.statusText}`)
      }

      setFormState({
        name: "",
        email: "",
        phone: "",
        message: "",
      })
      setIsSubmitting(false)
      setIsSubmitted(true)

      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsSubmitting(false)
      console.error("Submission error:", err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`rounded-xl border border-gold/10 bg-card p-8 shadow-lg ${isRtl ? "font-arabic text-right" : ""}`}
    >
      <h3 className="mb-6 text-2xl font-bold text-card-foreground">{dictionary.formTitle}</h3>

      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-8 text-center dark:bg-green-900/20"
        >
          <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
          <p className="text-lg font-medium text-green-800 dark:text-green-200">
            {dictionary.successMessage ||
              "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais."}
          </p>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-lg bg-red-50 p-8 text-center dark:bg-red-900/20"
        >
          <AlertCircle className="mb-4 h-16 w-16 text-red-500" />
          <p className="text-lg font-medium text-red-800 dark:text-red-200">
            {dictionary.errorMessage || "Une erreur s'est produite. Veuillez réessayer."}
          </p>
        </motion.div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-muted-foreground">
              {dictionary.nameLabel}
            </label>
            <input
              type="text"
              id="name"
              value={formState.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-muted-foreground">
              {dictionary.emailLabel}
            </label>
            <input
              type="email"
              id="email"
              value={formState.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-muted-foreground">
              {dictionary.telephoneLabel || (lang === "fr" ? "Téléphone" : lang === "ar" ? "الهاتف" : "Phone")}
            </label>
            <input
              type="tel"
              id="phone"
              value={formState.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-muted-foreground">
              {dictionary.messageLabel}
            </label>
            <textarea
              id="message"
              rows={5}
              value={formState.message}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              required
              disabled={isSubmitting}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
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
                  {lang === "fr" ? "Envoi en cours..." : lang === "ar" ? "جارٍ الإرسال..." : "Sending..."}
                </>
              ) : (
                <>
                  {dictionary.submitButton}
                  <Send className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </span>
          </button>
        </form>
      )}
    </motion.div>
  )
}