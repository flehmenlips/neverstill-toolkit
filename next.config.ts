import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static Intuit app pages live in /public as .html; serve them at clean URLs.
  rewrites: async () => [
    { source: "/privacy", destination: "/privacy.html" },
    { source: "/eula", destination: "/eula.html" },
    { source: "/qbo/launch", destination: "/qbo/launch.html" },
    { source: "/qbo/disconnect", destination: "/qbo/disconnect.html" },
  ],
  headers: async () => [
    {
      source: "/sw.js",
      headers: [
        {
          key: "Cache-Control",
          value: "no-cache, no-store, must-revalidate",
        },
        {
          key: "Service-Worker-Allowed",
          value: "/",
        },
      ],
    },
  ],
};

export default nextConfig;
