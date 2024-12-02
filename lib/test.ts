import { handleChat } from "@/app/functions/chat";

const body = {
  query: "yoo",
  feature: "giveback" as const,
  chatHistory: [
    { role: "user" as const, content: "hi" },
    { role: "assistant" as const, content: "hello" }
  ]
};

async function main() {
  console.log("starting");
  const data = await handleChat(body);
  console.log("data", data);
}

main();
