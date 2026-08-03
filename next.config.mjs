/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static HTML export → produces `out/`, deployed to Cloudflare Workers assets.
  // The app is fully client-side (no SSR, API routes, or server actions).
  output: "export",
  // Static export can't use the Next.js image optimizer; serve images as-is.
  // (No next/image today, but this keeps a future <Image> from breaking export.)
  images: { unoptimized: true },
  // Multiple lockfiles exist on this machine; pin the tracing root to this app.
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
