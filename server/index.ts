import { z } from "zod";
import { initTRPC } from "@trpc/server";
import { config } from "dotenv";
import { altDocs, documentation } from "./src/squiggle-docs";
import { prompt } from "./src/prompt";

config({
  path: ".env.local",
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create();
// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `Hello, ${opts.input.text}!`,
      };
    }),
  createForecast: procedure
    .input(z.object({ text: z.string(), squiggle: z.string() }))
    .mutation(async (opts) => {
      const content = altDocs(opts.input.text);
      const shape = z.object({
        js: z.string(),
      });
      const result = await prompt(content, shape, false);

      return result;
    }),
});

export type AppRouter = typeof appRouter;
