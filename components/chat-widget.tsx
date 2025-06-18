"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { X, Send, User, Loader2, Stethoscope, Sparkles, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 400)
    }
  }, [isOpen])

  // Initialiser avec un message de bienvenue
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "Bonjour ! Je suis votre assistant IA Le Merle, spécialisé en assistance médicale. Comment puis-je vous accompagner aujourd'hui ?",
        },
      ])
    }
  }, [isOpen])

  // Faire défiler vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    try {
      setIsLoading(true)
      setError(null)

      // Ajouter le message de l'utilisateur
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input,
      }

      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)
      setInput("")

      // Envoyer la requête à l'API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut: ${response.status}`)
      }

      const data = await response.json()

      // Ajouter la réponse de l'assistant
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: data.message,
        },
      ])
    } catch (err) {
      console.error("Chat error:", err)
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Bouton flottant ultra-moderne */}
      <motion.div
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.5,
        }}
        className="fixed bottom-8 right-8 z-50"
      >
        <div className="relative">
          {/* Cercles d'animation en arrière-plan */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 blur-xl"
          />

          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 blur-lg"
          />

          <Button
            onClick={() => setIsOpen(true)}
            className={cn(
              "group relative h-16 w-16 rounded-2xl",
              "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
              "border border-white/10 backdrop-blur-xl",
              "shadow-2xl shadow-black/25",
              "transition-all duration-500 ease-out",
              "hover:scale-110 hover:rotate-12",
              "hover:shadow-3xl hover:shadow-amber-500/25",
              "active:scale-95",
              "before:absolute before:inset-0 before:rounded-2xl",
              "before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent",
              "before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-300",
            )}
            aria-label="Ouvrir l'assistant IA médical"
          >
            <div className="relative z-10 flex items-center justify-center">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="absolute inset-2 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20"
              />

              <Stethoscope className="h-7 w-7 text-amber-400 drop-shadow-lg relative z-10" />

              {/* Particules flottantes */}
              <motion.div
                animate={{
                  y: [-2, -8, -2],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full"
              />

              <motion.div
                animate={{
                  y: [-1, -6, -1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-400 rounded-full"
              />
            </div>

            {/* Badge de notification */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
            >
              <Sparkles className="h-3 w-3 text-white" />
            </motion.div>
          </Button>
        </div>
      </motion.div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          className={cn(
            "w-full sm:max-w-xl flex flex-col p-0",
            "h-[100vh] sm:h-[90vh] max-h-[900px]",
            "border-0 sm:border-l sm:border-white/10",
            "rounded-none sm:rounded-tl-3xl sm:rounded-bl-3xl",
            "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
            "backdrop-blur-2xl shadow-2xl",
            "overflow-hidden",
          )}
        >
          {/* Effets de fond animés */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                x: [-100, 100, -100],
                y: [-50, 50, -50],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                x: [100, -100, 100],
                y: [50, -50, 50],
              }}
              transition={{
                duration: 25,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
            />
          </div>

          {/* En-tête moderne */}
          <SheetHeader className="relative z-10 p-6 border-b border-white/10">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <SheetTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-sm opacity-50"
                    />
                    <div className="relative w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Stethoscope className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                      Assistant IA Le Merle
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <p className="text-sm text-slate-400 font-medium">Intelligence Médicale Active</p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                  aria-label="Fermer l'assistant"
                >
                  <X className="h-5 w-5" />
                </Button>
              </SheetTitle>
            </motion.div>
          </SheetHeader>

          {/* Zone de messages avec glassmorphism */}
          <ScrollArea className="flex-grow relative z-10">
            <div className="p-6 space-y-6 min-h-full">
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.9 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className={cn("flex items-start gap-4", message.role === "user" ? "flex-row-reverse" : "")}
                  >
                    {/* Avatar avec effets */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center",
                        "border backdrop-blur-xl shadow-lg",
                        message.role === "user"
                          ? "bg-gradient-to-br from-slate-700/80 to-slate-800/80 border-slate-600/50 text-white"
                          : "bg-gradient-to-br from-amber-400/20 to-orange-500/20 border-amber-400/30 text-amber-400",
                      )}
                    >
                      {message.role === "user" ? <User className="h-5 w-5" /> : <Stethoscope className="h-5 w-5" />}
                    </motion.div>

                    {/* Bulle de message glassmorphism */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        "max-w-[85%] rounded-3xl px-6 py-4",
                        "backdrop-blur-xl border shadow-xl",
                        "relative overflow-hidden",
                        message.role === "user"
                          ? cn(
                              "bg-gradient-to-br from-slate-700/80 to-slate-800/80",
                              "text-white border-slate-600/50",
                              "rounded-tr-lg shadow-slate-900/50",
                            )
                          : cn(
                              "bg-gradient-to-br from-white/10 to-white/5",
                              "text-white border-white/20",
                              "rounded-tl-lg shadow-black/20",
                            ),
                      )}
                    >
                      {/* Effet de brillance */}
                      <motion.div
                        animate={{
                          x: [-100, 100],
                          opacity: [0, 0.5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatDelay: 3,
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                      />

                      <p className="text-sm leading-relaxed whitespace-pre-wrap relative z-10">{message.content}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Indicateur de chargement futuriste */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30 backdrop-blur-xl flex items-center justify-center shadow-lg">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Stethoscope className="h-5 w-5 text-amber-400" />
                    </motion.div>
                  </div>
                  <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl rounded-tl-lg px-6 py-4 backdrop-blur-xl shadow-xl">
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.2,
                            }}
                            className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-300 font-medium">Analyse IA en cours...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Message d'erreur moderne */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 backdrop-blur-xl flex items-center justify-center shadow-lg">
                    <X className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-3xl rounded-tl-lg px-6 py-4 backdrop-blur-xl shadow-xl">
                    <p className="text-sm text-red-300 font-medium mb-3">Connexion temporairement interrompue</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setError(null)}
                      className="text-xs text-red-300 hover:text-red-200 hover:bg-red-500/20 h-auto p-2 rounded-xl"
                    >
                      Réessayer
                    </Button>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Zone de saisie futuriste */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative z-10 p-6 border-t border-white/10"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl",
                  "bg-gradient-to-r from-white/10 to-white/5",
                  "border border-white/20 backdrop-blur-xl",
                  "shadow-xl transition-all duration-300",
                  "focus-within:border-amber-400/50 focus-within:shadow-2xl",
                  "focus-within:bg-gradient-to-r focus-within:from-white/15 focus-within:to-white/10",
                )}
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Décrivez votre situation médicale..."
                  className={cn(
                    "flex-grow border-0 bg-transparent text-white",
                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                    "placeholder:text-slate-400 text-base",
                  )}
                  disabled={isLoading}
                />

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className={cn(
                      "rounded-xl w-12 h-12 p-0 flex-shrink-0",
                      "transition-all duration-300",
                      "relative overflow-hidden",
                      input.trim() && !isLoading
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg hover:shadow-xl border border-amber-400/50"
                        : "bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-600/50",
                    )}
                    aria-label="Envoyer le message"
                  >
                    {/* Effet de brillance sur hover */}
                    {input.trim() && !isLoading && (
                      <motion.div
                        animate={{
                          x: [-100, 100],
                          opacity: [0, 0.5, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatDelay: 2,
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                      />
                    )}

                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin relative z-10" />
                    ) : (
                      <Send className="h-5 w-5 relative z-10" />
                    )}
                  </Button>
                </motion.div>
              </div>

              {/* Footer avec badges de sécurité */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-400">
                  <Shield className="h-3 w-3" />
                  <span>Chiffrement end-to-end</span>
                </div>
                <div className="text-slate-500">Le Merle IA © 2024</div>
              </div>
            </form>
          </motion.div>
        </SheetContent>
      </Sheet>
    </>
  )
}
