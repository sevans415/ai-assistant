import { NextResponse } from "next/server";
import { ClientChatHistory } from "@/lib/openai/chatbot";
import wellnessChatbot, { WellnessActivities } from "@/lib/wellnessChatbot";
import { generateCoachResponse } from "@/lib/coachChatbot";
import { OptionPackageType } from "@/components/constants";

export type ChatRequest = {
  query: string;
  chatHistory: ClientChatHistory[];
  feature: OptionPackageType;
};

export const maxDuration = 60; // This sets the maximum duration to

export type ChatResponse200 = {
  response: string;
  wellnessActivities: WellnessActivities | undefined;
};

export type ChatResponse500 = {
  error: string;
};

export type ChatResponse = ChatResponse200 | ChatResponse500;

export async function POST(
  request: Request
): Promise<NextResponse<ChatResponse>> {
  try {
    const {
      query: queryString,
      chatHistory,
      feature
    } = (await request.json()) as ChatRequest;

    if (feature === "coach") {
      const { response } = await generateCoachResponse(
        queryString,
        chatHistory
      );
      return NextResponse.json({ response, wellnessActivities: undefined });
    } else {
      const { response, wellnessActivities } = await wellnessChatbot(
        queryString,
        chatHistory
      );
      return NextResponse.json({ response, wellnessActivities });
    }
  } catch (error) {
    console.error("Error processing query:", error);
    return NextResponse.json(
      { error: "Failed to process query" },
      { status: 500 }
    );
  }
}
