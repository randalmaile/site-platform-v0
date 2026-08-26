import type { NextConfig } from "next";

/**
 * Deliberately empty.
 *
 * The base is a standard Next.js application. No redirects, no remote image
 * hosts, no deployment adapter — every one of those is a project decision or a
 * deployment-boundary concern (see `briefs/10-deployment.md`), and adding one
 * here would make it something every generated site inherits.
 */
const nextConfig: NextConfig = {};

export default nextConfig;
