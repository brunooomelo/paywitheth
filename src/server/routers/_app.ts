import { mergeRoutes } from "server/trpc";
import { productRouter } from "./product";

export const appRouter = mergeRoutes(productRouter);
export type AppRouter = typeof appRouter;
