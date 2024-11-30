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
import { ChatRequest, ChatResponse200 } from "@/app/api/chat/route";
import { useOptionPackage } from "@/hooks/useOptionPackage";
import { ClientChatHistory } from "@/lib/chatbot";
import { OptionsGrid } from "./chat/options-grid";

export default function ChatInterface() {
  const [messages, setMessages] = useState<ClientChatHistory[]>([]);
  const {
    getQueryAddendum,
    handleOptionClick,
    selectedOptions,
    setSelectedOptions,
    optionPackage,
    clearOptions,
    groupSize,
    setGroupSize,
    selectedLocationOptions,
    setSelectedLocationOptions
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

    setMessages([
      ...messages,
      { content: volunteerBotMessage, role: "assistant" }
    ]);
    handleOptionClick("volunteer");
  };

  const handleWellnessClick = () => {
    setIsExpanded(true);
    setMessages([
      ...messages,
      {
        content: wellnessBotMessage,
        role: "assistant"
      }
    ]);
    handleOptionClick("wellness");
  };

  const handleCoachClick = () => {
    setIsExpanded(true);
    setMessages([
      ...messages,
      {
        content: "What would you like coaching on for your 1:1?",
        role: "assistant"
      }
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
      setMessages([...messages, { content: inputValue, role: "user" }]);
      setIsLoading(true);

      try {
        const body: ChatRequest = {
          query:
            inputValue.trim() +
            (selectedOptions.length > 0 ? getQueryAddendum() : ""),
          chatHistory: messages.map(msg => ({
            role: msg.role,
            content:
              msg.content +
              (msg.role === "assistant" && msg.activityResults
                ? "\n\n search results from searchActivities tool call:" +
                  JSON.stringify(msg.activityResults)
                : "")
          }))
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

        const data = (await response.json()) as ChatResponse200;

        setMessages(prev => [
          ...prev,
          {
            content: data.response,
            role: "assistant",
            activityResults: data.activitiesResult
          }
        ]);
      } catch (error) {
        console.error("Error processing query:", error);
        setMessages(prev => [
          ...prev,
          {
            content:
              "Sorry, I encountered an error while processing your request.",
            role: "assistant"
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
    clearOptions();
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
                <MessageItem key={index} message={message}>
                  {message.role === "assistant" &&
                    index === messages.length - 1 &&
                    optionPackage?.title !== undefined && (
                      <OptionsGrid
                        selectedOptions={selectedOptions}
                        onOptionsChange={setSelectedOptions}
                        optionsTitle={optionPackage?.title}
                        options={optionPackage?.options}
                        groupSize={groupSize}
                        setGroupSize={setGroupSize}
                        selectedLocationOptions={selectedLocationOptions}
                        setSelectedLocationOptions={setSelectedLocationOptions}
                        locationOptions={optionPackage?.locationOptions}
                      />
                    )}
                </MessageItem>
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
