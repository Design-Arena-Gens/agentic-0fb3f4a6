import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { synthesizeResponse } from "@/lib/fallback-model";
import type { ChatPayload } from "@/lib/types";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-3.5-turbo";

export async function POST(request: NextRequest) {
  let payload: ChatPayload;

  try {
    payload = (await request.json()) as ChatPayload;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  if (!payload?.messages?.length) {
    return NextResponse.json(
      { error: "Please provide a conversation history." },
      { status: 400 }
    );
  }

  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: payload.messages,
        temperature: payload.temperature ?? 0.7,
        max_tokens: payload.maxOutputTokens ?? 512
      });

      const content = response.choices?.[0]?.message?.content?.trim();
      if (content) {
        return NextResponse.json({
          message: content,
          provider: "openai"
        });
      }
    } catch (error) {
      console.error("OpenAI request failed", error);
    }
  }

  const message = synthesizeResponse(payload);
  return NextResponse.json({ message, provider: "fallback" });
}
