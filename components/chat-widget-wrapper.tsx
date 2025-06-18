"use client"

import dynamic from "next/dynamic"

// Import dynamique du ChatWidget pour éviter les problèmes d'hydratation
const ChatWidget = dynamic(() => import("@/components/chat-widget").then((mod) => ({ default: mod.ChatWidget })), {
  ssr: false,
  loading: () => null,
})

export default function ChatWidgetWrapper() {
  return <ChatWidget />
}
