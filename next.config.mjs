import bundleAnalyzer from '@next/bundle-analyzer'
import createMDX from '@next/mdx'
import { mdxOptions } from './mdx-options.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Configure `pageExtensions` to include markdown and MDX files
	pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
	basePath: process.env.NEXT_PUBLIC_BASE_PATH,
	output: "export",
	trailingSlash: true,
	// Image Optimizer https://www.npmjs.com/package/next-image-export-optimizer?activeTab=readme
	images: {
		loader: "custom",
		// Every entry here is another generated file per source image, so keep
		// the list to the widths the layouts actually ask for.
		imageSizes: [96, 384],
		deviceSizes: [640, 1200],
	},
	transpilePackages: ["next-image-export-optimizer"],
	env: {
		nextImageExportOptimizer_imageFolderPath: "public/images",
		nextImageExportOptimizer_exportFolderPath: "out",
		nextImageExportOptimizer_quality: "75",
		nextImageExportOptimizer_storePicturesInWEBP: "true",
		nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",
		nextImageExportOptimizer_generateAndUseBlurImages: "true",
		// 10 days: CI should not re-download the staff headshots every run.
		nextImageExportOptimizer_remoteImageCacheTTL: "864000",
	},
};

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
})

const withMDX = createMDX({ options: mdxOptions })

export default withBundleAnalyzer(withMDX(nextConfig));
