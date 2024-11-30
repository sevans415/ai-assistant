import { NextResponse } from "next/server";
import {
  ActivitiesResults,
  ClientChatHistory,
  generateResponse
} from "@/lib/chatbot";

export type ChatRequest = {
  query: string;
  chatHistory: ClientChatHistory[];
};

export const maxDuration = 60; // This sets the maximum duration to

export type ChatResponse200 = {
  response: string;
  activitiesResult: ActivitiesResults | undefined;
};

export type ChatResponse500 = {
  error: string;
};

export type ChatResponse = ChatResponse200 | ChatResponse500;

export async function POST(
  request: Request
): Promise<NextResponse<ChatResponse>> {
  try {
    const { query: queryString, chatHistory } =
      (await request.json()) as ChatRequest;
    const prompt = queryString;

    console.log("prompt", prompt);
    const { response, activitiesResult } = await generateResponse(
      prompt,
      chatHistory
    );
    return NextResponse.json({ response, activitiesResult });
  } catch (error) {
    console.error("Error processing query:", error);
    return NextResponse.json(
      { error: "Failed to process query" },
      { status: 500 }
    );
  }
}
