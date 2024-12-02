import {
  ChatCompletionMessageParam,
  ChatCompletionTool
} from "openai/resources/index.mjs";
import { ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { getEmbeddings } from "./openai/embeddings";
import { PINECONE_GIVEBACKS_INDEX, queryPinecone } from "./pinecone";
import { generateResponse, formatContext } from "./openai/chatbot";
import { GivebackEmbeddingMetadata } from "./create-embeddings/createGivebackEmbeddings";

const SYSTEM_PROMPT = `You are a helpful volunteer activities recommendation assistant to help company managers find volunteer opportunities for their teams. Your goal is to chat with the user and direct them towards asking for activities. when they ask, analyze the user's request and the provided activities from our database, selecting the 3 most relevant options.

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
  const results = await queryPinecone(embedding, PINECONE_GIVEBACKS_INDEX);
  return results as ScoredPineconeRecord<GivebackEmbeddingMetadata>[];
}

export type GivebackActivities =
  ScoredPineconeRecord<GivebackEmbeddingMetadata>[];

export default async function wellnessChatbot(
  query: string,
  chatHistory: ChatCompletionMessageParam[] = []
): Promise<{ response: string; givebackActivities?: GivebackActivities }> {
  const { response, toolCallResult } = await generateResponse(
    query,
    chatHistory,
    SYSTEM_PROMPT,
    tools,
    searchActivities,
    formatContext
  );

  return { response, givebackActivities: toolCallResult };
}
