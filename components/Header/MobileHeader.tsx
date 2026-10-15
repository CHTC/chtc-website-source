'use client';

import React, {useState} from "react";
import Toolbar from "@mui/material/Toolbar";
import SiteSearch from '@/components/SiteSearch';
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import {Close, Menu} from "@mui/icons-material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Link from "@mui/material/Link"

import Title from "@/components/Header/Title";
import {NavigationItem} from "@/components/Header";

const MobileHeader = ({pages} : {pages: NavigationItem[]}) => {

	const [navOpen, setNavOpen] = useState(false)

	const handleDrawerOpen = () => setNavOpen(true);
	const handleDrawerClose = () => setNavOpen(false);

	return (
		<Toolbar disableGutters sx={{ py: 0.75 }}>
			<Grid container justifyContent="space-between" alignItems="center" flexGrow={1}>
				<Grid size={'auto'}>
					<IconButton
						size="large"
						aria-label="open navigation menu"
						aria-controls="menu-appbar"
						aria-haspopup="true"
						onClick={handleDrawerOpen}
						sx={{ color: 'text.primary' }}
					>
						<Menu />
					</IconButton>
				</Grid>
				<Grid size={'auto'}>
					<Title />
				</Grid>
				<Grid size={'auto'}>
					<SiteSearch variant="dialog" />
				</Grid>
			</Grid>
			<Drawer
				anchor="left"
				open={navOpen}
				onClose={handleDrawerClose}
			>
				<Box
					sx={{ width: "100vw" }}
					role="presentation"
					onClick={handleDrawerClose}
					onKeyDown={handleDrawerClose}
				>
					<List sx={{pt: 0}}>
						<Box sx={{ bgcolor: 'common.white', borderBottom: 1, borderColor: 'divider' }} mb={2}>
							<ListItem>
								<Title />
								<IconButton onClick={handleDrawerClose} sx={{marginLeft: 'auto', color: 'text.primary'}} aria-label="close navigation menu">
									<Close />
								</IconButton>
							</ListItem>
						</Box>
						{pages.map((page) => (
							<MobileNavigationItem key={page.path + page.label} page={page} />
						))}
					</List>
					<Divider />
					<List>
					</List>
				</Box>
			</Drawer>
		</Toolbar>
	)
}

const MobileNavigationItem = ({ page }: { page: NavigationItem }) => {
  if (page.children && page.children.length > 0) {
    return <MobileNavigationFolder page={page} />;
  } else {
		const raw = page.path ?? '';
		const isExternal = /^https?:\/\//.test(raw);
		// Internal paths get a trailing slash (matches `trailingSlash` export);
		// external URLs are used verbatim.
		const href = isExternal
			? raw
			: `${raw.replace(/\.mdx?$|\/index\.md$/, '').replace(/\/$/, '')}/`;
    return (
			<Link href={href} color="inherit" underline={'none'}>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemText primary={page.label} />
					</ListItemButton>
				</ListItem>
			</Link>
    );
  }
};

const MobileNavigationFolder = ({ page }: { page: NavigationItem }) => {
  const [open, setOpen] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={handleToggle}>
          <ListItemText primary={page.label} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 2 }}>
          {page.children?.map((child) => (
            <MobileNavigationItem key={child.label + (child.path || "")} page={child} />
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default MobileHeader;
