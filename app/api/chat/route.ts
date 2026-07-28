import { NextRequest, NextResponse } from "next/server";
import { portfolioKnowledge } from "@/lib/portfolioKnowledge";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

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
            ...messages,
          ],
          temperature: 0.5,
          max_tokens: 500,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return NextResponse.json(
        { error: "Failed to get response" },
        { status: 500 }
      );
    }

    const reply = data.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}