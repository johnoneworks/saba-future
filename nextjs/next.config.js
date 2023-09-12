/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config.js");

const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true
    },
    images: {
        domains: ["ipfs.infura.io"]
    },
    i18n
};

module.exports = nextConfig;
