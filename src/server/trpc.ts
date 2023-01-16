import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";
import { Context } from "./context";

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      errors:
        error.code === "BAD_REQUEST" && error.cause instanceof ZodError
          ? error.cause.flatten().fieldErrors
          : null,
    };
  },
});

export const router = t.router;
export const procedure = t.procedure;
export const mergeRoutes = t.mergeRouters;
