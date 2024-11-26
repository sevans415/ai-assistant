import { NextResponse } from "next/server";
import { processQuery } from "@/lib/chatbot";

export type ChatRequest = {
  query: string;
  options: string[];
};

export const maxDuration = 60; // This sets the maximum duration to

export async function POST(request: Request) {
  try {
    const { query: queryString, options } =
      (await request.json()) as ChatRequest;
    let prompt = queryString;
    if (options?.length > 0) {
      prompt += `\n\n the user is specifically interested in: ${options.join(
        ", "
      )}`;
    }

    console.log("prompt", prompt);
    const response = await processQuery(prompt);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error processing query:", error);
    return NextResponse.json(
      { error: "Failed to process query" },
      { status: 500 }
    );
  }
}
