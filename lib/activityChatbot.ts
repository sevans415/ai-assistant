import {
  ChatCompletionMessageParam,
  ChatCompletionTool
} from "openai/resources/index.mjs";
import { ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { EmbeddingMetadata } from "./createWellnessEmbeddings";
import { openai, getEmbeddings } from "./openai";
import { queryPinecone } from "./pinecone";

function formatContext(context: ScoredPineconeRecord<EmbeddingMetadata>[]) {
  return context
    .map(
      (activity, i) =>
        `${i + 1}. Score: ${activity.score} Text: ${activity.metadata?.text}`
    )
    .join("\n");
}

const SYSTEM_PROMPT = `You are a helpful local activities recommendation assistant. Your goal is to chat with the user and direct them towards asking for activities. when they ask, analyze the user's request and the provided activities from our database, selecting the 3 most relevant options.

You have access to the following tool:
- searchActivities(query: string): Searches the vector database for activities matching the query and returns relevant matches with similarity scores.

When making recommendations:
- Use the searchActivities tool to find relevant activities based on the user's request
- Important! Do not make any recommendations that do not come from the results of using the searchActivities tool
- Quickly recap in a sentence the user's preferences and any other context you have about them.
- Format your response in a friendly, conversational way. For any URL links, just return the Title. Do not use bullet points or **bold** text.
- For each recommendation, explain briefly why it's a good match for their request
- At the end of your response, say something to the effect of, "Click the activity you're interested in to learn more and book a Connect. Or keep chatting for more recommendations!"

If none of the provided activities are relevant, apologize and explain why they might not be suitable matches.`;

const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "searchActivities",
      description:
        "Search for activities based on what the users preferences are",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "The search query describing desired activities. pass along all information that the user provided"
          }
        },
        required: ["query"]
      }
    }
  }
];

async function searchActivities(query: string) {
  const embedding = await getEmbeddings(query);
  const results = await queryPinecone(embedding);
  return results;
}

type UserChat = {
  role: "user";
  content: string;
};

type AssistantChat = {
  role: "assistant";
  content: string;
  activityResults?: ActivitiesResults;
};

export type ClientChatHistory = UserChat | AssistantChat;

export type ActivitiesResults = ScoredPineconeRecord<EmbeddingMetadata>[];

export async function generateResponse(
  query: string,
  chatHistory: ChatCompletionMessageParam[] = []
) {
  const startTime = Date.now();

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system" as const,
      content: SYSTEM_PROMPT
    },
    ...chatHistory,
    {
      role: "user" as const,
      content: query
    }
  ];

  let activitiesResult: ActivitiesResults | undefined;

  // Keep track of the conversation until we get a final response
  let response;
  while (true) {
    response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      tools,
      tool_choice: "auto"
    });

    const responseMessage = response.choices[0].message;

    // Add assistant's message to conversation
    messages.push(responseMessage);

    // Check if there's a tool call
    if (responseMessage.tool_calls) {
      // Handle each tool call
      for (const toolCall of responseMessage.tool_calls) {
        if (toolCall.function.name === "searchActivities") {
          // Parse the arguments and call the function
          const args = JSON.parse(toolCall.function.arguments);
          console.log("CALLING TOOL!, w/ args", args);
          activitiesResult = (await searchActivities(
            args.query
          )) as ScoredPineconeRecord<EmbeddingMetadata>[];

          // Add the function response to the messages
          messages.push({
            role: "tool" as const,
            tool_call_id: toolCall.id,
            content: formatContext(activitiesResult)
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

  console.log("response", activitiesResult);

  return { response: response.choices[0].message.content!, activitiesResult };
}
