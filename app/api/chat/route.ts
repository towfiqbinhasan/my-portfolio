import { NextRequest, NextResponse } from "next/server";
import { portfolioKnowledge } from "@/lib/portfolioKnowledge";
import { offlineAnswer } from "@/lib/offlineAnswer";

/** Latest visitor question, used by the built-in fallback answers. */
function lastQuestion(messages: { role?: string; content?: string }[]) {
  return [...messages].reverse().find((m) => m?.role === "user" && typeof m.content === "string")?.content ?? "";
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { reply: "Invalid request format." },
        { status: 400 }
      );
    }

    // No AI key configured: answer from the portfolio facts instead of failing.
    if (!process.env.GROQ_API_KEY) {
      console.warn("GROQ_API_KEY is missing; chat is using the built-in answers");
      return NextResponse.json({ reply: offlineAnswer(lastQuestion(messages)) });
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
          model: "openai/gpt-oss-120b",
          messages: [
            { role: "system", content: portfolioKnowledge },
            ...cleanMessages,
          ],
          temperature: 0.5,
          max_tokens: 500,
          reasoning_effort: "low",
        }),
      }
    );

    const data = await response.json();

    // AI unavailable or empty answer: fall back to the built-in answers.
    if (!response.ok) {
      console.error("Groq API error:", data);
      return NextResponse.json({ reply: offlineAnswer(lastQuestion(cleanMessages)) });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("Unexpected Groq response:", data);
      return NextResponse.json({ reply: offlineAnswer(lastQuestion(cleanMessages)) });
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