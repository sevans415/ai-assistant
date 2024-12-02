import { ScoredPineconeRecord } from "@pinecone-database/pinecone";

import {
  ChatCompletionMessageParam,
  ChatCompletionTool
} from "openai/resources/index.mjs";
import { openai } from "./helpers";
import { RecordMetadata } from "@pinecone-database/pinecone";
import { WellnessActivities } from "@/lib/wellnessChatbot";
import { GivebackActivities } from "@/lib/givebackChatbot";

type UserChat = {
  role: "user";
  content: string;
};

type AssistantChat = {
  role: "assistant";
  content: string;
  wellnessActivities?: WellnessActivities;
  givebackActivities?: GivebackActivities;
};

export type ClientChatHistory = UserChat | AssistantChat;

export async function generateResponse<T>(
  query: string,
  chatHistory: ChatCompletionMessageParam[] = [],
  systemPrompt: string,
  tools: ChatCompletionTool[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toolFn: (args: any) => Promise<T>,
  formatToolResponse: (response: T) => string
) {
  const startTime = Date.now();

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system" as const,
      content: systemPrompt
    },
    ...chatHistory,
    {
      role: "user" as const,
      content: query
    }
  ];

  let toolCallResult: T | undefined;

  // Keep track of the conversation until we get a final response
  let response;
  while (true) {
    console.log("calling openai chat completions");
    response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      tools,
      tool_choice: "auto"
    });
    console.log("openai chat completions complete");

    const responseMessage = response.choices[0].message;

    // Add assistant's message to conversation
    messages.push(responseMessage);

    // Check if there's a tool call
    if (responseMessage.tool_calls) {
      // Handle each tool call
      // TODO: only allow one tool call at a time
      for (const toolCall of responseMessage.tool_calls) {
        if (toolCall.function.name === "searchActivities") {
          // Parse the arguments and call the function
          const args = JSON.parse(toolCall.function.arguments);
          console.log("CALLING TOOL!, w/ args", args);

          toolCallResult = await toolFn(args.query);

          // Add the function response to the messages
          messages.push({
            role: "tool" as const,
            tool_call_id: toolCall.id,
            content: formatToolResponse(toolCallResult)
          });
        }
      }
      // Continue the conversation with the function results
      continue;
    }

    // If no tool calls, we have our final response
    break;
  }

  console.log(`OpenAI API call completed in ${Date.now() - startTime}ms`);

  return { response: response.choices[0].message.content!, toolCallResult };
}

type MinimumMetadata = RecordMetadata & {
  text: string;
};

export function formatContext(
  context: ScoredPineconeRecord<MinimumMetadata>[]
): string {
  return context
    .map(
      (activity, i) =>
        `${i + 1}. Score: ${activity.score} Text: ${activity.metadata?.text}`
    )
    .join("\n");
}
