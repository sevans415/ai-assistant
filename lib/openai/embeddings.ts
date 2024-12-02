import { openai } from "./helpers";

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
