"use client";

import { PostHogProvider, usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const options = {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
};

export function Posthog({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    return (
      <PostHogProvider
        apiKey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
        options={options}
      >
        {children}
        <TrackPageViews />
      </PostHogProvider>
    );
  }
  return <>{children}</>;
}

export function TrackPageViews() {
  const posthog = usePostHog();
  const location = usePathname();

  useEffect(() => {
    if (!posthog) return;

    // new
    posthog.capture("$pageview");
  }, [location, posthog]);

  return null;
}
