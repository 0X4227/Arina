const isProduction = process.env.NODE_ENV === 'devlopment';
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
});

const nextConfig = {
    images: {
      unoptimized: true,
    },
    basePath: isProduction ? '/arina' : '',
    output: 'export',
    distDir: 'build',
    reactStrictMode: true,
  };
module.exports = withPWA(nextConfig);
