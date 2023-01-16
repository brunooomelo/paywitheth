import { inferAsyncReturnType } from "@trpc/server";
import { Redis } from "@upstash/redis";

const db = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

export async function createContext() {
  return {
    db,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
