// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   reactCompiler: true,
// };

// export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {

// //   reactCompiler: true,
//   // @ts-ignore - Suppress strict type checking on webpack configuration parameters

//   webpack: (config, { isServer }) => {
//     config.experiments = {
//       ...config.experiments,
//       asyncWebAssembly: true,
//     };

//     if (!isServer) {
//       config.resolve = config.resolve || {};
//       config.resolve.fallback = {
//         ...config.resolve.fallback,
//         fs: false,
//       };
//     }
//     return config;
//   },
// };

// module.exports = nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // 🚀 Tell Turbopack how to handle the SQL WebAssembly binary file
//   experimental: {
//     turbo: {
//       rules: {
//         "*.wasm": ["asset/resource"],
//       },
//     },
//   },
// };

// module.exports = nextConfig;
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Next.js handles standard assets smoothly by default. 
   Leaving this object clean eliminates the 'Unrecognized key' warning!
  */
};

export default nextConfig;