"use client";

import {} from "itzam";
import { Check, Plus } from "lucide-react";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import {
  createThread,
  getThreadRuns,
  getUserThreads,
} from "~/server/itzam/turtle";
import { Button } from "./ui/button";

type Thread = {
  id: string;
  name: string;
  lookupKeys: string[];
  createdAt: string;
  updatedAt: string;
};

export const Threads = ({
  session,
  currentThreadId,
  setCurrentThreadId,
  setMessages,
}: {
  session: Session;
  currentThreadId: string;
  setCurrentThreadId: (threadId: string) => void;
  setMessages: (
    messages: Array<{ role: "user" | "assistant"; content: string }>,
  ) => void;
}) => {
  const [threads, setThreads] = useState<Thread[]>([]);

  const handleCreateThread = async () => {
    const thread = await createThread(session?.user?.id ?? "");
    setThreads((prev) => [thread, ...prev]);
    setCurrentThreadId(thread.id);
    setMessages([]);
  };

  const handleSelectThread = async (threadId: string) => {
    const runs = await getThreadRuns(threadId);
    const messages = runs.flatMap((run) => [
      { role: "user" as const, content: run.input },
      { role: "assistant" as const, content: run.output },
    ]);
    setMessages(messages);
    setCurrentThreadId(threadId);
  };

  useEffect(() => {
    const fetchThreads = async () => {
      const { threads } = await getUserThreads(session?.user?.id ?? "");
      setThreads(threads);
    };
    void fetchThreads();
  }, [session]);

  return (
    <div className="mx-auto mt-4 flex max-w-3xl min-w-2xl flex-col gap-2 rounded-md border bg-neutral-100 p-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-neutral-500">Threads</h2>
        <Button variant="outline" size="sm" onClick={handleCreateThread}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:block">New thread</span>
        </Button>
      </div>
      {threads.length === 0 && (
        <div className="text-sm text-neutral-500">No threads found</div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className={cn(
              "border-muted-foreground/20 flex cursor-pointer items-center gap-2 rounded-md border bg-neutral-200 p-2 text-sm transition-colors",
              currentThreadId === thread.id
                ? "bg-neutral-300"
                : "hover:bg-neutral-300",
            )}
            onClick={() => handleSelectThread(thread.id)}
          >
            {thread.name}
            {thread.id === currentThreadId && <Check className="h-4 w-4" />}
          </div>
        ))}
      </div>
    </div>
  );
};
