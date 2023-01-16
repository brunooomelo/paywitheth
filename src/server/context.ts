import { inferAsyncReturnType } from "@trpc/server";
import { Redis } from "@upstash/redis";
import { ethers } from "ethers";

const db = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

const provider = new ethers.providers.JsonRpcProvider(process.env.RPCPROVIDER);

export async function createContext() {
  return {
    db,
    provider,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
