'use client'

import React, { useRef, useState } from "react";
import NextLink from "next/link";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import Title from "@/components/Header/Title";
import { NavigationItem } from "@/components/Header";

// Render dropdowns above the sticky AppBar (zIndex.appBar === 1100).
const MENU_ZINDEX = 1300;

// Open on hover, with a small delay before closing so the pointer can travel
// across a sub-pixel gap between trigger and menu without flicker.
function useHoverMenu() {
	const [open, setOpen] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const enter = () => {
		if (timer.current) clearTimeout(timer.current);
		setOpen(true);
	};
	const leave = () => {
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => setOpen(false), 120);
	};

	return { open, enter, leave };
}

/** Top-level menu labels: dark text on the white bar, like the legacy `uw-nav-menu-reverse`. */
const topButtonSx = {
	my: 1.5,
	px: 1.25,
	color: 'text.primary',
	fontWeight: 600,
	fontSize: '0.95rem',
	'& .MuiButton-endIcon': { color: 'primary.main', ml: 0.25 },
	'&:hover': { bgcolor: 'transparent', color: 'primary.main' },
} as const;

/**
 * A navigation node that may contain children. At the top level it renders as a
 * bar button with a downward caret; nested inside a dropdown it renders as a
 * menu item with a rightward caret that opens a flyout submenu. Leaf nodes are
 * plain anchor links. Recurses to arbitrary depth.
 */
const NavNode = ({ item, top = false }: { item: NavigationItem; top?: boolean }) => {
	const hasChildren = !!item.children?.length;
	const anchorRef = useRef<HTMLElement | null>(null);
	const { open, enter, leave } = useHoverMenu();

	if (!hasChildren) {
		return top ? (
			<Button component={NextLink} href={item.path ?? '#'} sx={topButtonSx}>
				{item.label}
			</Button>
		) : (
			<MenuItem component={NextLink} href={item.path ?? '#'} sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
				<ListItemText primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</ListItemText>
			</MenuItem>
		);
	}

	const trigger = top ? (
		<Button
			ref={anchorRef as React.RefObject<HTMLButtonElement>}
			endIcon={<KeyboardArrowDownIcon />}
			sx={topButtonSx}
			aria-haspopup="true"
			aria-expanded={open}
		>
			{item.label}
		</Button>
	) : (
		<MenuItem ref={anchorRef as React.RefObject<HTMLLIElement>} sx={{ color: 'primary.main' }}>
			<ListItemText primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</ListItemText>
			<KeyboardArrowRightIcon fontSize="small" sx={{ color: 'primary.main' }} />
		</MenuItem>
	);

	return (
		<Box onMouseEnter={enter} onMouseLeave={leave} sx={{ display: top ? 'inline-flex' : 'block' }}>
			{trigger}
			<Popper
				open={open}
				anchorEl={anchorRef.current}
				placement={top ? 'bottom-start' : 'right-start'}
				disablePortal
				sx={{ zIndex: MENU_ZINDEX }}
			>
				<Paper elevation={0} sx={{ minWidth: 240, borderRadius: 0, border: 1, borderColor: 'divider', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
					<MenuList dense>
						{item.children!.map((child) => (
							<NavNode key={child.label + (child.path ?? '')} item={child} />
						))}
					</MenuList>
				</Paper>
			</Popper>
		</Box>
	);
};

/** The parent organisations' marks shown beside the CHTC logo, as on the legacy header. */
const PARTNERS = [
	{ href: 'https://cai.wisc.edu/', src: '/images/logos/UW_Crest.svg', alt: 'UW-Madison College of Computing, Data & Information Sciences', width: 35 },
	{ href: 'https://morgridge.org', src: '/images/logos/Morgridge_Logo.svg', alt: 'Morgridge Institute for Research', width: 65 },
];

const DesktopHeader = ({ pages }: { pages: NavigationItem[] }) => {
	return (
		// Extra vertical room so the logo bar reads as the site's main header.
		<Toolbar disableGutters sx={{ py: 1.25 }}>
			<Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1.5 }}>
				<Box sx={{ flex: '0 0 auto' }}>
					<Title />
				</Box>
				<Box sx={{ alignSelf: 'stretch', my: 1.5, borderLeft: 2, borderColor: 'primary.main', display: { xs: 'none', lg: 'block' } }} />
				<Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1, pr: 1 }}>
					{PARTNERS.map((p) => (
						<Box key={p.href} component="a" href={p.href} target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-flex' }}>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img src={p.src} alt={p.alt} height={40} width={p.width} />
						</Box>
					))}
				</Box>
				<Box component="nav" aria-label="Main menu" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
					{pages.map((page) => (
						<NavNode key={page.label} item={page} top />
					))}
				</Box>
			</Box>
		</Toolbar>
	);
};

export default DesktopHeader;
