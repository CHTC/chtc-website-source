import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import React from "react";

import GlobalBar from './GlobalBar';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';
import {NavigationItem} from "@/components/Header";

/**
 * Site header, after the legacy UW-themed one: the red global bar, then a
 * white navigation bar with the CHTC logo, the parent organisations' marks
 * and the main menu.
 */
const Header = ({pages} : {pages: NavigationItem[]}) => {
	return (
		<Box component='header'>
			<GlobalBar />
			<AppBar
				position="sticky"
				elevation={0}
				sx={{
					bgcolor: 'common.white',
					color: 'text.primary',
					borderBottom: 1,
					borderColor: 'divider',
				}}
			>
				<Container maxWidth="lg">
					<Box sx={{ display: { xs: 'block', md: 'none' } }}>
						<MobileHeader pages={pages} />
					</Box>
					<Box sx={{ display: { xs: 'none', md: 'block' } }}>
						<DesktopHeader pages={pages} />
					</Box>
				</Container>
			</AppBar>
		</Box>
	)
}

export default Header;
