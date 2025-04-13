import { genAICode } from "@/configs/AIModel";
import { NextRequest, NextResponse } from "next/server";

interface AIResponse {
  projectTitle: string;
  explanation: string;
  files: {
    [key: string]: {
      code: string;
    };
  };
  generatedFiles: string[];
}

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  try {
    const result = await genAICode.sendMessage(prompt);
    const resp = await result.response.text();
    return NextResponse.json(JSON.parse(resp) as AIResponse);
  } catch (e) {
    const error = e as Error;
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}