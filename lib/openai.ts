import { OpenAI } from "openai";
import dotenv from "dotenv";
import { ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { EmbeddingMetadata } from "./createEmbeddings";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const EMBEDDING_MODEL = "text-embedding-3-small";

export async function getBatchEmbeddings(
  inputs: string[]
): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: inputs
    });

    console.log(response);

    // Extract the embeddings from the response
    const embeddings = response.data.map(item => item.embedding);

    return embeddings;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw error;
  }
}

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

const SYSTEM_PROMPT = `You are a helpful local activities recommendation assistant. Your goal is to analyze the user's request and the provided activities from our database, selecting the 3 most relevant options.
When making recommendations:
- Consider the semantic relevance of each activity to the user's request
- Factor in the similarity scores provided by the vector search
- Present exactly 3 recommendations, even if more good matches exist
- Format your response in a friendly, conversational way
- For each recommendation, explain briefly why it's a good match for their request

If none of the provided activities are relevant, apologize and explain why they might not be suitable matches.`;

// Function to generate a response using OpenAI
export async function generateResponse(
  query: string,
  context: ScoredPineconeRecord<EmbeddingMetadata>[]
) {
  const startTime = Date.now();
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview", // Updated to latest model
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT
      },
      {
        role: "user",
        content: `User Query: "${query}"

Available Activities (sorted by relevance score):
${formatContext(context)}`
      }
    ]
  });

  console.log(`OpenAI API call completed in ${Date.now() - startTime}ms`);
  console.log("bot response", JSON.stringify(response, null, 2));
  return response.choices[0].message.content;
}
