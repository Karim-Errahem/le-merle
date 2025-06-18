"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, User, Mail, MessageSquare, Phone, AlertCircle } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"

interface ContactFormResProps {

  lang: Locale
}

export default function ContactFormRes({  lang }: ContactFormResProps) {
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isRtl = lang === "ar"

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Failed to submit form: ${response.statusText}`)
      }

      setFormData({ name: "", email: "", phone: "", message: "" })
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
    <div className={`w-full ${isRtl ? "font-arabic text-right" : ""}`}>
      <h3 className="mb-4 text-xl font-semibold text-[#FFC000]">{dictionary.formTitle}</h3>

      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-green-500/10 p-4 text-green-500"
        >
          {dictionary.successMessage || "Votre message a été envoyé avec succès!"}
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-500/10 p-4 text-red-500 flex items-center"
        >
          <AlertCircle className="h-5 w-5 mr-2" />
          {dictionary.errorMessage || "Une erreur s'est produite. Veuillez réessayer."}
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={dictionary.nameLabel}
                className={`w-full rounded-lg border border-white/10 bg-white/5 p-3 pl-10 text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-[#FFC000]/50 focus:outline-none focus:ring-1 focus:ring-[#FFC000]/50 ${
                  isRtl ? "font-arabic text-right" : ""
                }`}
                disabled={isSubmitting}
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={dictionary.emailLabel}
                className={`w-full rounded-lg border border-white/10 bg-white/5 p-3 pl-10 text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-[#FFC000]/50 focus:outline-none focus:ring-1 focus:ring-[#FFC000]/50 ${
                  isRtl ? "font-arabic text-right" : ""
                }`}
                disabled={isSubmitting}
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={dictionary.telephoneLabel || (lang === "fr" ? "Téléphone" : lang === "ar" ? "الهاتف" : "Phone")}
                className={`w-full rounded-lg border border-white/10 bg-white/5 p-3 pl-10 text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-[#FFC000]/50 focus:outline-none focus:ring-1 focus:ring-[#FFC000]/50 ${
                  isRtl ? "font-arabic text-right" : ""
                }`}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-start pl-3 pt-3">
              <MessageSquare className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder={dictionary.messageLabel}
              rows={2}
              className={`w-full rounded-lg border border-white/10 bg-white/5 p-3 pl-10 text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-[#FFC000]/50 focus:outline-none focus:ring-1 focus:ring-[#FFC000]/50 ${
                isRtl ? "font-arabic text-right" : ""
              }`}
              disabled={isSubmitting}
            ></textarea>
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-[#FFC000] to-amber-400 px-6 py-3 text-base font-medium text-gray-900 shadow-lg transition-all duration-300 hover:shadow-[#FFC000]/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center">
              {isSubmitting ? (
                <>
                  <svg
                    className="mr-2 h-5 w-5 animate-spin text-gray-900"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
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
                  <Send className="mr-2 h-5 w-5" />
                  {dictionary.submitButton}
                </>
              )}
            </span>
            <motion.span
              className="absolute bottom-0 left-0 right-0 top-0 bg-white/10"
              initial={{ x: "100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </motion.button>
        </form>
      )}
    </div>
  )
}