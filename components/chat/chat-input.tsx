import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowUp } from "lucide-react";
import { Globe } from "lucide-react";
import { Button } from "../ui/button";
import { Paperclip } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  showSubmitButton?: boolean;
  className?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  showSubmitButton = true,
  className
}: ChatInputProps) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(e);
      }}
      className={cn("relative transition-all duration-500", className)}
    >
      <Card className="bg-background border-border">
        <div className="flex items-center gap-2 p-2">
          <Input
            placeholder="Message Happyly Assistant"
            className="bg-transparent border-0 shadow-none placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={value}
            onChange={e => onChange(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white hover:bg-zinc-700"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white hover:bg-zinc-700"
            >
              <Globe className="h-5 w-5" />
            </Button>
            {showSubmitButton && (
              <Button
                type="submit"
                size="icon"
                disabled={!value}
                className="bg-primary hover:bg-primary/80 rounded-lg"
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </form>
  );
}
