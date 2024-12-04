import { ClientChatHistory } from "@/lib/openai/chatbot";
import ActivitiesResult from "./activity-results";

interface MessageItemProps {
  message: ClientChatHistory;
  children?: React.ReactNode;
}

export function MessageItem({ message, children }: MessageItemProps) {
  return (
    <div
      className={`p-4 rounded-lg ${
        message.role === "assistant"
          ? "bg-accent mr-8"
          : "bg-secondary-foreground text-zinc-300 ml-8"
      }`}
    >
      <p className="whitespace-pre-wrap">
        {message.content
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .replace(/\*\*([^*]+)\*\*/g, "$1")}
      </p>
      {message.role === "assistant" && message.wellnessActivities && (
        <ActivitiesResult activities={message.wellnessActivities} />
      )}
      {message.role === "assistant" && message.givebackActivities && (
        <ActivitiesResult activities={message.givebackActivities} />
      )}
      {children}
    </div>
  );
}
