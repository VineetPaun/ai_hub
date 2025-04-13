import { chatSession } from "@/configs/AIModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  try {
    const result = await chatSession.sendMessage(prompt);
    const AIResp = await result.response.text();
    return NextResponse.json({ result: AIResp });
  } catch (e: any) {
    console.error("AI Chat API Error:", e);
    return NextResponse.json(
      { error: e.message || "An error occurred" },
      { status: 500 }
    );
  }
}
