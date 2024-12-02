import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { openai } from "./openai/helpers";

const SYSTEM_PROMPT = `You are an experienced career coach specializing in helping professionals prepare for one-on-one meetings at work. Your goal is to help users have more effective 1:1s with their managers or direct reports.

When helping users:
- Ask clarifying questions to understand their specific situation and concerns
- Provide actionable advice based on proven management and communication practices
- Help them structure their thoughts and create clear talking points
- Guide them in addressing difficult conversations or feedback
- Suggest ways to make their 1:1s more productive and meaningful

Format your responses in a friendly, conversational way. Avoid bullet points or overly formal language.

If the user seems stuck or unsure, help them by suggesting common 1:1 topics like:
- Career growth and development
- Current projects and challenges
- Work-life balance
- Team dynamics and collaboration
- Performance feedback
- Goal setting and progress review

enriched data from database: the user's direct report mentioned that they would like to discuss their career goals more and wants to work on more customer facing projects. if those topics haven't already been discussed maybe they would be a good topic for today. 

When using the enriched data from database, mention that you pulled that information from the database.
`;

type UserChat = {
  role: "user";
  content: string;
};

type AssistantChat = {
  role: "assistant";
  content: string;
};

export type ClientChatHistory = UserChat | AssistantChat;

export async function generateCoachResponse(
  query: string,
  chatHistory: ChatCompletionMessageParam[] = []
) {
  const startTime = Date.now();

  console.log("query: ", query);

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: SYSTEM_PROMPT
    },
    ...chatHistory,
    {
      role: "user",
      content: query
    }
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages
  });

  console.log(`OpenAI API call completed in ${Date.now() - startTime}ms`);

  return {
    response: response.choices[0].message.content!,
    // Since we don't have activity results, we can either omit this or return undefined
    activityResults: undefined
  };
}
