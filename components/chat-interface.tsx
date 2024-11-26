"use client";

import { useState, useRef, useEffect } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MessageItem } from "@/components/chat/message-item";
import { ChatInput } from "@/components/chat/chat-input";
import PillActionButtons, {
  PillActionType
} from "@/components/chat/pill-action-buttons";
import { Header } from "@/components/chat/header";
import { volunteerBotMessage, wellnessBotMessage } from "./constants";
import { ChatRequest } from "@/app/api/chat/route";
import { useOptionPackage } from "@/hooks/useOptionPackage";

export default function ChatInterface() {
  const [messages, setMessages] = useState<
    Array<{ text: string; isBot: boolean }>
  >([]);
  const {
    optionPackageType,
    handleOptionClick,
    selectedOptions,
    setSelectedOptions,
    optionPackage,
    clearOptions
  } = useOptionPackage();
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleVolunteerClick = () => {
    setIsExpanded(true);

    setMessages([...messages, { text: volunteerBotMessage, isBot: true }]);
    handleOptionClick("volunteer");
  };

  const handleWellnessClick = () => {
    setIsExpanded(true);
    setMessages([
      ...messages,
      {
        text: wellnessBotMessage,
        isBot: true
      }
    ]);
    handleOptionClick("wellness");
  };

  const handleCoachClick = () => {
    setIsExpanded(true);
    setMessages([
      ...messages,
      { text: "What would you like coaching on for your 1:1?", isBot: true }
    ]);
    handleOptionClick("coach");
  };

  const handlePillClick = (type: PillActionType) => {
    if (type === "volunteer") {
      handleVolunteerClick();
    } else if (type === "wellness") {
      handleWellnessClick();
    } else if (type === "coach") {
      handleCoachClick();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setInputValue("");
      setIsExpanded(true);
      clearOptions();
      setMessages([...messages, { text: inputValue, isBot: false }]);
      setIsLoading(true);

      try {
        const body: ChatRequest = {
          query: inputValue.trim(),
          options: selectedOptions
        };

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          throw new Error("Failed to get response from chatbot");
        }

        const data = await response.json();

        setMessages(prev => [...prev, { text: data.response, isBot: true }]);
      } catch (error) {
        console.error("Error processing query:", error);
        setMessages(prev => [
          ...prev,
          {
            text: "Sorry, I encountered an error while processing your request.",
            isBot: true
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReset = () => {
    setIsExpanded(false);
    setMessages([]);
    handleOptionClick();
    setInputValue("");
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col">
      <Header isExpanded={isExpanded} onReset={handleReset} />

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 gap-4">
        {!isExpanded && (
          <div
            className={cn(
              "flex flex-col items-center justify-center min-h-[80vh]"
            )}
          >
            <h1 className="text-3xl font-semibold text-white mb-8">
              Hey Spencer, what can I help with?
            </h1>
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
              showSubmitButton={false}
              className="w-full mb-8"
            />
            <PillActionButtons onClick={handlePillClick} />
          </div>
        )}

        <div
          className={cn(
            "flex flex-col flex-1",
            isExpanded ? "opacity-100" : "opacity-0"
          )}
        >
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="space-y-4 mb-4">
              {messages.map((message, index) => (
                <MessageItem
                  key={index}
                  message={message}
                  isLatest={index === messages.length - 1}
                  selectedOptions={selectedOptions}
                  onOptionsChange={setSelectedOptions}
                  displayOptions={optionPackageType !== undefined}
                  optionsTitle={optionPackage?.title}
                  options={optionPackage?.options}
                />
              ))}
              {isLoading && (
                <div className="flex items-center space-x-1 animate-fade-in p-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {isExpanded && (
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            showSubmitButton={true}
          />
        )}
      </div>
    </div>
  );
}
