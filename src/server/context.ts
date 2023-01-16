import { inferAsyncReturnType } from "@trpc/server";
import { JsonDB, Config } from "node-json-db";

const db = new JsonDB(new Config("database", true, false, "./"));
export async function createContext() {
  return {
    db,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
