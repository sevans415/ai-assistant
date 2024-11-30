import { OpenAI } from "openai";
import dotenv from "dotenv";
import { ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { EmbeddingMetadata } from "./createWellnessEmbeddings";
import { queryPinecone } from "./pinecone";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool
} from "openai/resources/index.mjs";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const EMBEDDING_MODEL = "text-embedding-3-small";

export async function getEmbeddings(input: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input
  });

  return response.data[0].embedding;
}

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
- Consider the semantic relevance of each activity to the user's request
- Factor in the similarity scores provided by the vector search
- Present exactly 3 recommendations, even if more good matches exist
- Format your response in a friendly, conversational way
- For each recommendation, explain briefly why it's a good match for their request

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

  let activitiesResult;

  // Keep track of the conversation until we get a final response
  let response;
  while (true) {
    response = await openai.chat.completions.create({
      model: "gpt-4",
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
          const results = (await searchActivities(
            args.query
          )) as ScoredPineconeRecord<EmbeddingMetadata>[];

          activitiesResult = results;

          // Add the function response to the messages
          messages.push({
            role: "tool" as const,
            tool_call_id: toolCall.id,
            content: formatContext(results)
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
  console.log("bot response", JSON.stringify(response, null, 2));
  return { response: response.choices[0].message.content, activitiesResult };
}

async function main() {
  console.log("user: Hey, how are you?");
  const { response } = await generateResponse("Hey, how are you?");
  console.log("bot:", response);

  console.log("user: what kind of questions can I ask you");
  const { response: response2 } = await generateResponse(
    "what kind of questions can I ask you"
  );

  console.log("bot:", response2);

  console.log("user: I want to go on a hike. I'm in DC");
  const { response: response3, activitiesResult: activitiesResult2 } =
    await generateResponse("I want to go on a hike. I'm in DC");
  console.log("bot:", response3);
  console.log("activitiesResult2", activitiesResult2);
}

main();
