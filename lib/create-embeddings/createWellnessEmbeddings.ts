import Papa from "papaparse";
import * as fs from "fs";
import { getBatchEmbeddings } from "@/lib/openai";
import { upsertEmbeddings, PINECONE_WELLNESS_INDEX } from "@/lib/pinecone";
import { RecordMetadata } from "@pinecone-database/pinecone";
import { extractParagraphsFromHTMLString } from "./helpers";

interface WellnessActivity {
  id: string;
  headline: string;
  short_description: string;
  content: string;
  hours: string;
  cost: string;
  address: string;
  tips: string;
  score: number;
  good_all_year_round: boolean;
  good_for_spring: boolean;
  good_for_summer: boolean;
  good_for_fall: boolean;
  good_for_winter: boolean;
  good_any_day: boolean;
  // note: this is incomplete, I'm just grabbing the fields I need for now
}

function loadWellnessActivities(filePath: string): WellnessActivity[] {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, errors } = Papa.parse(fileContent, {
      header: true, // Treat first row as headers
      skipEmptyLines: true,
      transform: value => value.trim()
    });

    if (errors.length > 0) {
      console.warn("Parsing warnings:", errors);
    }

    return data as WellnessActivity[];
  } catch (error) {
    console.error("Error loading wellness activities:", error);
    return [];
  }
}

function cleanActivity(activity: WellnessActivity): WellnessActivity {
  return {
    ...activity,
    content: extractParagraphsFromHTMLString(activity.content).join("\n")
  };
}

function formatActivity(activity: WellnessActivity): string {
  return `
Headline: ${activity.headline}\n
Short Description: ${activity.short_description}\n
Content: ${activity.content}\n
Hours: ${activity.hours}\n
Cost: ${activity.cost}\n
Address: ${activity.address}\n
Tips: ${activity.tips}`;
}

export type EmbeddingMetadata = RecordMetadata & {
  headline: string;
  shortDescription: string;
  content: string;
  hours: string;
  cost: string;
  address: string;
  tips: string;
  text: string;
};

function buildEmbeddingMetadata(
  activity: WellnessActivity,
  embeddedText: string
): EmbeddingMetadata {
  return {
    text: embeddedText,
    headline: activity.headline,
    shortDescription: activity.short_description,
    content: activity.content,
    hours: activity.hours,
    cost: activity.cost,
    address: activity.address,
    tips: activity.tips
  };
}

async function main() {
  const activities = loadWellnessActivities(
    "./wellness_activities_11-21-24.csv"
  );

  console.log(`Loaded ${activities.length} activities`);

  const activitiesToEmbed = activities.filter(a => a.score > 75);

  const cleanedActivities = activitiesToEmbed.map(cleanActivity);

  const formattedActivities = cleanedActivities.map(formatActivity);

  const embeddings = await getBatchEmbeddings(formattedActivities);

  const embeddingsToUpsert = cleanedActivities.map((activity, i) => ({
    id: activity.id,
    values: embeddings[i],
    metadata: buildEmbeddingMetadata(activity, formattedActivities[i])
  }));

  await upsertEmbeddings(embeddingsToUpsert, PINECONE_WELLNESS_INDEX);

  console.log(`Done! Upserted ${embeddingsToUpsert.length} embeddings`);
}

main();
