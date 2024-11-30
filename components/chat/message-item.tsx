import { ClientChatHistory } from "@/lib/chatbot";
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
          ? "bg-blue-600 text-white mr-8"
          : "bg-zinc-800 text-zinc-300 ml-8"
      }`}
    >
      <p className="whitespace-pre-wrap">
        {message.content
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .replace(/\*\*([^*]+)\*\*/g, "$1")}
      </p>
      {message.role === "assistant" && message.activityResults && (
        <ActivitiesResult activities={message.activityResults} />
      )}
      {children}
    </div>
  );
}
