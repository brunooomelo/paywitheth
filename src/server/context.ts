import path from "path";
import { inferAsyncReturnType } from "@trpc/server";
import { InMemoryDatabase } from "in-memory-database";

const db = new InMemoryDatabase();
db.set("0f29c741-f083-4805-8cc4-13c73a05e803", {
  id: "0f29c741-f083-4805-8cc4-13c73a05e803",
  name: "NFT #1",
  url: "https://pbs.twimg.com/media/Fkj1j1zVEAAOpeI?format=jpg&name=large",
  value: "0.01",
  owner: "",
  transactionHash: "",
  createdBy: "0x9939DD143F8055518d09c7BC479B16e7D537204E",
});
export async function createContext() {
  return {
    db,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
