/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Multiple lockfiles exist on this machine; pin the tracing root to this app.
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
