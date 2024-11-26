import { ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { EmbeddingMetadata } from "./createEmbeddings";
import { generateResponse, getEmbeddings } from "./openai";
import { queryPinecone } from "./pinecone";

// Main function to process a query
export async function processQuery(query: string) {
  try {
    console.log(`Processing query: ${query}`);
    const startTime = Date.now();

    const queryEmbedding = await getEmbeddings(query);
    console.log(`Embeddings generated in ${Date.now() - startTime}ms`);

    const relevantDocs = (await queryPinecone(
      queryEmbedding
    )) as ScoredPineconeRecord<EmbeddingMetadata>[];
    console.log(`Pinecone query completed in ${Date.now() - startTime}ms`);
    console.log(`Found ${relevantDocs.length} relevant documents`);

    const response = await generateResponse(query, relevantDocs);
    console.log(`Total processing time: ${Date.now() - startTime}ms`);

    return response;
  } catch (error) {
    console.error("Error processing query:", error);
    if (error instanceof Error && error.message.includes("timeout")) {
      return "Sorry, the request timed out. Please try again or try a simpler query.";
    }
    return "Sorry, I encountered an error while processing your query.";
  }
}
