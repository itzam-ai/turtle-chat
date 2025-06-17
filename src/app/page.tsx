"use client";

import { Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { EmptyState } from "~/components/empty-state";
import { Header } from "~/components/header";
import LoginDialog from "~/components/login-dialog";
import { Message } from "~/components/message";
import { Threads } from "~/components/threads";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { talkToTurtle } from "~/server/itzam/turtle";

export default function HomePage() {
  const { data: session } = useSession();

  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessage("");

    // Add user message
    setMessages((prev) => [
      ...prev,
      { role: "user" as const, content: message },
    ]);

    // Add empty assistant message
    setMessages((prev) => [
      ...prev,
      { role: "assistant" as const, content: "" },
    ]);

    const response = await talkToTurtle(message, currentThreadId ?? "");

    for await (const chunk of response.stream) {
      setMessages((prev) => {
        const emptyAssistantMessage = prev[prev.length - 1];
        if (!emptyAssistantMessage) return prev;

        return [
          ...prev.slice(0, -1),
          {
            ...emptyAssistantMessage,
            content: emptyAssistantMessage.content + chunk,
          },
        ];
      });
    }
  };

  if (!session) {
    return <LoginDialog />;
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-neutral-50">
      <Header session={session} />
      <Threads
        session={session}
        currentThreadId={currentThreadId ?? ""}
        setCurrentThreadId={setCurrentThreadId}
        setMessages={setMessages}
      />

      {/* Chat Area */}
      <div className="mx-auto flex w-full max-w-3xl min-w-2xl flex-1 flex-col">
        <ScrollArea className="flex-1 pt-12 pb-24">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <Message key={index} msg={msg} session={session} />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <form
          onSubmit={handleSendMessage}
          className="fixed right-0 bottom-0 left-0 mx-auto flex max-w-3xl min-w-2xl gap-2 bg-neutral-50 p-4 pt-0"
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              currentThreadId
                ? "🐢 Talk to Turtle..."
                : "Select a thread to start chatting"
            }
            disabled={!currentThreadId}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!message.trim()}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
