import defaultNextConfig from "@sushiswap/nextjs-config";

/** @type {import('next').NextConfig} */
const nextConfig = {
	...defaultNextConfig,
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	transpilePackages: ["@sushiswap/ui"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "static.tronscan.org",
				port: "",
				pathname: "**",
			},
		],
	},
	async redirects() {
		return [
			{
				source: "/",
				permanent: true,
				destination: "/swap",
			},
		];
	},
	async rewrites() {
		return [];
	},
};

export default nextConfig;
