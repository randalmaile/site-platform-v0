import type { NextConfig } from "next";

/**
 * Deliberately minimal.
 *
 * Keystatic's local GitHub App setup redirects through `127.0.0.1`, while
 * Next's development server starts on `localhost`. Next blocks that dev-only
 * cross-origin asset request unless the callback host is explicitly allowed.
 * This setting affects development only.
 */
const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
