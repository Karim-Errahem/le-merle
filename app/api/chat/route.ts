import { NextResponse } from 'next/server'
import Replicate from "replicate"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  console.log("Received POST request")

  try {
    const body = await req.json()
    console.log("Request body parsed:", body)

    const { messages } = body
    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages format:", messages)
      return NextResponse.json({ error: "Invalid input format" }, { status: 400 })
    }

    const replicateToken = process.env.REPLICATE_API_TOKEN
    if (!replicateToken) {
      console.error("Missing REPLICATE_API_TOKEN")
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 })
    }

    const replicate = new Replicate({
      auth: replicateToken,
    })

    const lastUserMessage = messages.length > 0 
      ? messages[messages.length - 1].content 
      : "Hello"
    console.log("Last user message:", lastUserMessage)

    let systemPrompt = "Vous êtes un assistant utile pour Le Merle Assistance Médicale. Soyez concis et serviable. Répondez en français.\n\n"

    if (messages.length > 1) {
      systemPrompt += "Historique de la conversation:\n"
      for (let i = 0; i < messages.length - 1; i++) {
        const role = messages[i].role === "user" ? "Utilisateur" : "Assistant"
        systemPrompt += `${role}: ${messages[i].content}\n`
      }
      systemPrompt += "\n"
    }

    console.log("System prompt prepared:\n", systemPrompt)

    // Appel à l'API Replicate sans streaming
    const output = await replicate.run(
  "openai/gpt-4.1-nano",
  {
    input: {
      prompt: lastUserMessage,
      system_prompt: systemPrompt
    }
  }
) as string[]

const fullResponse = output.join('')


    console.log("Full response from Replicate:", fullResponse)

    return NextResponse.json({ message: fullResponse })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}