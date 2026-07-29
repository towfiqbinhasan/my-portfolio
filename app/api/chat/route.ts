import { NextRequest, NextResponse } from "next/server";
import { portfolioKnowledge } from "@/lib/portfolioKnowledge";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is missing in environment variables");
      return NextResponse.json(
        { reply: "Server is not configured properly. Please contact the admin." },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { reply: "Invalid request format." },
        { status: 400 }
      );
    }

    // Groq (OpenAI-compatible) শুধু role আর content accept করে —
    // অন্য কোনো extra field (যেমন "typing") থাকলে API error দেয়, তাই এখানে আবার clean করা হচ্ছে
    const cleanMessages = messages
      .filter((m: { role?: string; content?: string }) => m?.role && typeof m?.content === "string")
      .map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      }));

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: portfolioKnowledge },
            ...cleanMessages,
          ],
          temperature: 0.5,
          max_tokens: 500,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", data);
      return NextResponse.json(
        { reply: "Sorry, something went wrong while contacting the AI." },
        { status: 500 }
      );
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("Unexpected Groq response:", data);
      return NextResponse.json(
        { reply: "Sorry, I couldn't generate a response. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { reply: "Sorry, something went wrong. Please try again." },
      { status: 500 }
    );
  }
}