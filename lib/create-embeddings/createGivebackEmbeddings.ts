import * as fs from "fs";
import * as path from "path";
import { getBatchEmbeddings } from "../openai/embeddings";
import { PINECONE_GIVEBACKS_INDEX, upsertEmbeddings } from "../pinecone";
import { RecordMetadata } from "@pinecone-database/pinecone";
import { extractParagraphsFromHTMLString } from "./helpers";

interface GivebackActivity {
  activity_id: number;
  headline: string;
  header_image: string;
  short_description: string;
  content: string;
  date_notes?: string;
  location_target?: string;
  location_type: string;
  universal_notes?: string;
  organization_name: string;
  organization_description: string;
  addresses: string[];
  week_day_names: string[];
  things_to_know_titles: string[];
  things_to_know_sub_headlines: string[];
  category_names: string[];
  // note: this is incomplete, I'm just grabbing the fields I need for now
}

function loadGivebackActivities(): GivebackActivity[] {
  try {
    const jsonPath = path.join(__dirname, "givebacks.json");

    // Read and parse the JSON file
    const givebacks = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    return givebacks as GivebackActivity[];
  } catch (error) {
    console.error("Error loading wellness activities:", error);
    return [];
  }
}

function cleanActivity(activity: GivebackActivity): GivebackActivity {
  return {
    ...activity,
    content: extractParagraphsFromHTMLString(activity.content).join("\n")
  };
}

function formatActivity(activity: GivebackActivity): string {
  return `
Headline: ${activity.headline}
Short Description: ${activity.short_description}
Content: ${activity.content}
Date Notes: ${activity.date_notes}
Location Type: ${activity.location_type}
Organization Description: ${activity.organization_description}
Addresses: ${activity.addresses}
Categories: ${activity.category_names}
Things to know: ${activity.things_to_know_sub_headlines}
Week Days available: ${activity.week_day_names}
`;
}

export type GivebackEmbeddingMetadata = RecordMetadata & {
  id: number;
  text: string;
  headline: string;
  shortDescription: string;
  weekDaysAvailable: string[];
  categories: string[];
  locationType: string;
  content: string;
  addresses: string[];
  headerImage: string;
};

function buildEmbeddingMetadata(
  activity: GivebackActivity,
  embeddedText: string
): GivebackEmbeddingMetadata {
  return {
    id: activity.activity_id,
    text: embeddedText,
    headline: activity.headline,
    shortDescription: activity.short_description,
    weekDaysAvailable: activity.week_day_names,
    categories: activity.category_names,
    locationType: activity.location_type,
    content: activity.content,
    addresses: activity.addresses,
    headerImage: activity.header_image
  };
}

async function main(dryRun: boolean = true) {
  const activities = loadGivebackActivities();

  console.log(`Loaded ${activities.length} activities`);

  const cleanedActivities = activities.map(cleanActivity);

  const formattedActivities = cleanedActivities.map(formatActivity);

  if (dryRun) {
    console.log(formattedActivities.slice(0, 5));
    return;
  } else {
    const embeddings = await getBatchEmbeddings(formattedActivities);

    const embeddingsToUpsert = cleanedActivities.map((activity, i) => ({
      id: `${activity.activity_id}`,
      values: embeddings[i],
      metadata: buildEmbeddingMetadata(activity, formattedActivities[i])
    }));

    await upsertEmbeddings(embeddingsToUpsert, PINECONE_GIVEBACKS_INDEX);

    console.log(`Done! Upserted ${embeddingsToUpsert.length} embeddings`);
  }
}

main(false);
