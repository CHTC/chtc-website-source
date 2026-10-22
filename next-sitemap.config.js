/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: `https://${process.env.HOSTNAME}` || 'https://example.com',
	output: "export",
	// Match `trailingSlash: true` in next.config.mjs
	trailingSlash: true,
	// Internal staff documentation (also `noindex` and disallowed in robots.txt).
	exclude: ['/uw-research-computing/staff', '/uw-research-computing/staff/*'],
}
