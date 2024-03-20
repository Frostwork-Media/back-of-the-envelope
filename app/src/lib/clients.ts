import { QueryClient } from "@tanstack/react-query";
import { trpc } from "./trpc";
import { unstable_httpBatchStreamLink } from "@trpc/client";

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [
    unstable_httpBatchStreamLink({
      url: "/api/trpc",
    }),
  ],
});
