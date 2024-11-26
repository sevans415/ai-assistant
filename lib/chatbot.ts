import { ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { EmbeddingMetadata } from "./createEmbeddings";
import { generateResponse, getEmbeddings } from "./openai";
import { queryPinecone } from "./pinecone";

// Main function to process a query
export async function processQuery(query: string) {
  try {
    console.log(`processing query: ${query}`);
    const queryEmbedding = await getEmbeddings(query);
    console.log("got embeddings");

    // Get relevant documents from Pinecone
    const relevantDocs = (await queryPinecone(
      queryEmbedding
    )) as ScoredPineconeRecord<EmbeddingMetadata>[];

    console.log("got relevant docs from pinecone");

    // Generate a response using OpenAI
    const response = await generateResponse(query, relevantDocs);
    console.log("got response from LLM");

    // console.log("response", response);

    return response;
  } catch (error) {
    console.error("Error processing query:", error);
    return "Sorry, I encountered an error while processing your query.";
  }
}
