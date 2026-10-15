import type { Metadata } from "next";

import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from '@mui/material/CssBaseline';

import { chtcFonts } from "@chtc/web-components/themes"

import theme from "./theme"
import "./globals.css"
import Header, { type NavigationItem } from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { siteConfig } from "@/site.config";

/*
 * Site-wide metadata. Every page inherits what it does not set, so this holds
 * only the fields that are true of the whole site.
 *
 * `openGraph` and `twitter` deliberately carry no title, description or url:
 * a child that sets plain `title`/`description` does not get its values
 * copied into an inherited `openGraph` block, so anything named here would
 * stick on every page. Left unset, Next fills og:title and og:description
 * from each page's own title and description. The shared og:image comes from
 * `opengraph-image.png` in this folder, which applies to every route.
 */
export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
	metadataBase: new URL(siteConfig.url),
	applicationName: siteConfig.name,
	openGraph: {
		type: "website",
		siteName: siteConfig.name,
		locale: siteConfig.locale,
	},
	twitter: {
		card: "summary_large_image",
	},
};

/** Mirrors the legacy `_data/main-menu.yml`. */
const pages: NavigationItem[] = [
	{
		label: 'Campus Computing',
		children: [
			{ label: 'Campus Computing Services', path: '/uw-research-computing' },
			{ label: 'Resources for Faculty', path: '/faculty-resources' },
			{ label: 'User Portal', path: '/uw-research-computing/user-portal' },
		],
	},
	{ label: 'Technologies', path: '/technologies' },
	{
		label: 'Community',
		children: [
			{ label: 'News', path: '/news' },
			{ label: 'Spotlights', path: '/spotlights' },
			{ label: 'Events', path: '/events' },
			{ label: 'Presentations', path: '/presentations' },
		],
	},
	{
		label: 'About',
		children: [
			{ label: 'About CHTC', path: '/about' },
			{ label: 'Talk To Us', path: '/talk-to-us' },
			{ label: 'Our Approach', path: '/approach' },
			{ label: 'What is HTC?', path: '/htc' },
			{ label: 'Our Customers', path: '/projects' },
			{ label: 'Staff', path: '/people' },
			{ label: 'Open Positions', path: '/jobs' },
			{ label: 'Research', path: '/research' },
		],
	},
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={chtcFonts.map((font) => font.className).join(' ')}>
			{ process.env.NEXT_PUBLIC_MATOMO_URL && process.env.NEXT_PUBLIC_MATOMO_SITE_ID &&
				<Analytics url={process.env.NEXT_PUBLIC_MATOMO_URL} siteId={process.env.NEXT_PUBLIC_MATOMO_SITE_ID} />
			}
      <AppRouterCacheProvider>
        {/*
          ThemeProvider has to wrap CssBaseline and the body Box, not just the
          page content: both read from the theme, and outside the provider they
          resolve against MUI's default one.
        */}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box component={"body"} sx={{ margin: 0, padding: 0, bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
						<Header pages={pages} />
						{/* What Pagefind indexes: the page, minus the header and footer. */}
						<Box data-pagefind-body sx={{ display: 'contents' }}>
							{children}
						</Box>
            <Footer />
          </Box>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </html>
  );
}
