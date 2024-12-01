import { Pinecone, RecordMetadata } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

// Target the index where you'll store the vector embeddings
export const PINECONE_WELLNESS_INDEX = "happyly-wellness-activities";
export const PINECONE_GIVEBACKS_INDEX = "happyly-giveback-activities";

export type EmbeddingRecord = {
  id: string;
  values: number[];
  metadata: RecordMetadata;
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

export async function upsertEmbeddings(
  values: EmbeddingRecord[],
  indexName: typeof PINECONE_WELLNESS_INDEX | typeof PINECONE_GIVEBACKS_INDEX
) {
  const index = pc.index(indexName);
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
  indexName: typeof PINECONE_WELLNESS_INDEX | typeof PINECONE_GIVEBACKS_INDEX,
  topK: number = 3
) {
  const index = pc.index(indexName);
  const queryResponse = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true
  });

  return queryResponse.matches;
}
