import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bundle the login-gated GDevelop project zip with its download route.
  outputFileTracingIncludes: {
    "/api/downloads/gdevelop-chapter-1": ["./private/gdevelop/**/*"],
  },
};

export default nextConfig;
