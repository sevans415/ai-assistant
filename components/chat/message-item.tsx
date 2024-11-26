import { OptionsGrid } from "@/components/chat/options-grid";

interface MessageItemProps {
  message: { text: string; isBot: boolean };
  isLatest: boolean;
  selectedOptions: string[];
  displayOptions?: boolean;
  optionsTitle?: string;
  options?: string[];
  onOptionsChange: (options: string[]) => void;
}

export function MessageItem({
  message,
  isLatest,
  selectedOptions,
  displayOptions = true,
  optionsTitle = "Please select the volunteer opportunities you're interested in:",
  options = [],
  onOptionsChange
}: MessageItemProps) {
  return (
    <div
      className={`p-4 rounded-lg ${
        message.isBot
          ? "bg-blue-600 text-white mr-8"
          : "bg-zinc-800 text-zinc-300 ml-8"
      }`}
    >
      <p className="whitespace-pre-wrap">{message.text}</p>
      {message.isBot && isLatest && displayOptions && (
        <OptionsGrid
          selectedOptions={selectedOptions}
          onOptionsChange={onOptionsChange}
          optionsTitle={optionsTitle}
          options={options}
        />
      )}
    </div>
  );
}
