"use server";

import Itzam from "itzam";
import { env } from "~/env";

const itzam = new Itzam(env.ITZAM_API_KEY);

const workflowSlug = "turtle-chat";

export const talkToTurtle = async (message: string, threadId: string) => {
  const response = await itzam.streamText({
    input: message,
    threadId,
  });

  return response;
};

// Threads
export const createThread = async (userId: string) => {
  const thread = await itzam.threads.create({
    workflowSlug,
    lookupKeys: [userId, "web"],
  });

  return thread;
};

export const getUserThreads = async (userId: string) => {
  const threads = await itzam.threads.list(workflowSlug, {
    lookupKeys: [userId, "web"],
  });

  return threads;
};

export const getThreadRuns = async (threadId: string) => {
  const { runs } = await itzam.threads.getRuns(threadId);

  return runs;
};
