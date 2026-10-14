import type { MetadataRoute } from 'next'
import { siteConfig } from '@/site.config'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			allow: ['/'],
			disallow: [],
		},
		sitemap: `${siteConfig.url}/sitemap.xml`,
		host: siteConfig.url,
	}
}
