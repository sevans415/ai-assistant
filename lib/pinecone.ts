import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

// Target the index where you'll store the vector embeddings
const PINECONE_INDEX_NAME = "happyly-wellness-activities";
const index = pc.index(PINECONE_INDEX_NAME);

export type EmbeddingRecord = {
  id: string;
  values: number[];
  metadata: Record<string, any>;
};

/**
 * Pinecone Batch Size Limits based on Vector Dimensions
 * https://docs.pinecone.io/guides/data/upsert-data#upsert-limits
 *
 * The max upsert size is 2MB or 1000 records, whichever is reached first. Therefore we need to split up the batches.
 *
 * | Dimension | Metadata (bytes) | Max batch size |
 * |-----------|-----------------|----------------|
 * | 386       | 0               | 1000          |
 * | 768       | 500             | 559           |
 * | 1536      | 2000            | 245           |
 */

function batchSplit<T>(items: T[], batchSize: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / batchSize) }, (_, i) =>
    items.slice(i * batchSize, (i + 1) * batchSize)
  );
}

export async function upsertEmbeddings(values: EmbeddingRecord[]) {
  const batches = batchSplit(values, 230);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    try {
      await index.upsert(batch);
      console.log(
        `Upserted batch ${i + 1}/${batches.length} (${batch.length} embeddings)`
      );
    } catch (error) {
      console.error(`Error upserting batch ${i + 1}/${batches.length}:`, error);
    }
  }
}

// Function to query Pinecone and get relevant documents
export async function queryPinecone(
  queryEmbedding: number[],
  topK: number = 5
) {
  const queryResponse = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true
  });

  console.log("pinecone response", queryResponse);

  return queryResponse.matches;
}
