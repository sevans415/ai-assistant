"use client";

import { useState, useRef, useEffect } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MessageItem } from "@/components/chat/message-item";
import { ChatInput } from "@/components/chat/chat-input";
import PillActionButtons from "@/components/chat/pill-action-buttons";
import { Header } from "@/components/chat/header";
import {
  coachBotMessage,
  homepageWelcome,
  OptionPackageType,
  volunteerBotMessage,
  wellnessBotMessage
} from "./constants";
import { ChatRequest, ChatResponse200 } from "@/app/api/chat/route";
import { useOptionPackage } from "@/hooks/useOptionPackage";
import { ClientChatHistory } from "@/lib/openai/chatbot";
import { OptionsGrid } from "./chat/options-grid";

export default function ChatInterface() {
  const [messages, setMessages] = useState<ClientChatHistory[]>([]);
  const {
    getQueryAddendum,
    handleOptionClick,
    selectedOptions,
    setSelectedOptions,
    optionPackageType,
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
    handleOptionClick("giveback");
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
        content: coachBotMessage,
        role: "assistant"
      }
    ]);
    handleOptionClick("coach");
  };

  const handlePillClick = (type: OptionPackageType) => {
    if (type === "giveback") {
      handleVolunteerClick();
    } else if (type === "wellness") {
      handleWellnessClick();
    } else if (type === "coach") {
      handleCoachClick();
    }
  };

  const handleSubmit = async (userText: string) => {
    if (userText.trim()) {
      setInputValue("");
      setIsExpanded(true);
      clearOptions();
      setMessages([...messages, { content: userText, role: "user" }]);
      setIsLoading(true);

      try {
        const body: ChatRequest = {
          query:
            userText.trim() +
            (selectedOptions.length > 0 ? getQueryAddendum() : ""),
          feature: optionPackageType ?? "giveback",
          chatHistory: messages.map(msg => ({
            role: msg.role,
            content:
              msg.content +
              (msg.role === "assistant" && msg.wellnessActivities
                ? "\n\n search results from searchActivities tool call:" +
                  JSON.stringify(msg.wellnessActivities)
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
            wellnessActivities: data.wellnessActivities,
            givebackActivities: data.givebackActivities
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
              onSubmit={() => handleSubmit(inputValue)}
              showSubmitButton={false}
              className="w-full mb-8"
            />
            <PillActionButtons onClick={handlePillClick} />
            <p className="text-white mb-8 text-center whitespace-pre-wrap">
              {homepageWelcome}
            </p>
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
                    optionPackage?.optionsTitle !== undefined && (
                      <OptionsGrid
                        selectedOptions={selectedOptions}
                        onOptionsChange={setSelectedOptions}
                        optionPackage={optionPackage}
                        groupSize={groupSize}
                        setGroupSize={setGroupSize}
                        handleSubmit={handleSubmit}
                        selectedLocationOptions={selectedLocationOptions}
                        setSelectedLocationOptions={setSelectedLocationOptions}
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
            onSubmit={() => handleSubmit(inputValue)}
            showSubmitButton={true}
          />
        )}
      </div>
    </div>
  );
}
