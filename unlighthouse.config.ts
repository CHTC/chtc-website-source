// Defaults to the demo deployment, which stands in for production for now. To
// scan a local build, serve it (`npx serve out -l 3000`) and set
// UNLIGHTHOUSE_SITE=http://localhost:3000.
const SITE = process.env.UNLIGHTHOUSE_SITE ?? 'http://chtc-nextjs.demo.chtc.io'

/**
 * The path of a sitemap `<loc>`. Deployments built before the sitemap's
 * `siteUrl` was fixed wrote `https://http://host/path`, which `new URL()`
 * reads as host `http`, so the scheme(s) and host are stripped by hand.
 */
const locPath = (loc: string) => loc.replace(/^(?:https?:\/\/)+[^/]*/, '') || '/'

async function fetchLocs(path: string): Promise<string[]> {
	const res = await fetch(new URL(path, SITE))
	if (!res.ok)
		throw new Error(`Failed to fetch ${path} from ${SITE}: ${res.status}`)
	const xml = await res.text()
	return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc)
}

// next-sitemap writes absolute URLs for the production host, so read the
// sitemaps from SITE ourselves and keep only each entry's path.
async function sitemapPaths(): Promise<string[]> {
	const sitemaps = await fetchLocs('/sitemap.xml')
	const locs = (await Promise.all(sitemaps.map((loc) => fetchLocs(locPath(loc))))).flat()
	const paths = locs
		.map(locPath)
		// trailingSlash: true, so request the canonical URL and avoid a redirect per page
		.map((path) => (path.endsWith('/') ? path : `${path}/`))
		.filter((path) => path !== '/404/')
		// Search Console's site-verification file, not a page
		.filter((path) => !/^\/google[0-9a-f]+\/$/.test(path))
	return [...new Set(paths)]
}

export default {
	site: SITE,
	urls: sitemapPaths,
	scanner: {
		dynamicSampling: true,
		samples: 5,
		throttle: true,
		maxRoutes: false,
	},
	puppeteerClusterOptions: {
		maxConcurrency: 1,
	},
}
