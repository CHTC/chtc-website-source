'use client';

import { useState, type MouseEvent } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  Button,
  Collapse,
  Container,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import type { SectionNavItem } from '../_lib/docs';
import { HEADER_HEIGHT, SECTION_NAV_HEIGHT } from '../_lib/layout';

const isExternal = (url: string) => /^[a-z]+:/i.test(url);
const withSlash = (p: string) => (p.endsWith('/') ? p : `${p}/`);

/** A top-level entry with a dropdown (desktop). */
const DropdownItem = ({ item, active }: { item: SectionNavItem; active: boolean }) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <>
      <Button
        onClick={(event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget)}
        endIcon={<KeyboardArrowDownIcon />}
        aria-haspopup='true'
        aria-expanded={anchor ? 'true' : undefined}
        sx={navButtonSx(active)}
      >
        {item.label}
      </Button>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
        {[{ label: `${item.label} overview`, path: item.path }, ...(item.children ?? [])].map(
          (child) => (
            <MenuItem
              key={child.path}
              component={isExternal(child.path) ? 'a' : NextLink}
              href={child.path}
              onClick={() => setAnchor(null)}
            >
              {child.label}
            </MenuItem>
          )
        )}
      </Menu>
    </>
  );
};

const navButtonSx = (active: boolean) => ({
  color: 'common.white',
  opacity: active ? 1 : 0.85,
  fontWeight: active ? 700 : 500,
  borderRadius: 0,
  borderBottom: '3px solid',
  borderColor: active ? 'common.white' : 'transparent',
  py: 1.25,
  px: 1.5,
  whiteSpace: 'nowrap',
  '&:hover': { opacity: 1, bgcolor: 'rgba(255, 255, 255, 0.08)' },
});

/**
 * The Campus Computing sub-navigation from the legacy
 * `_includes/navbar/uw-research-computing-navbar.html`, fed by
 * `_data/uw-research-computing-menu.yml`. Sits under the global header on
 * every page of the section and stays there as the page scrolls, as a red
 * bar so the section reads as a place of its own.
 */
const HOME = '/uw-research-computing/';

/** Index of the guides as plain text, for pasting into an LLM (see scripts/llms-full.mjs). */
const LLMS_TXT = '/llms.txt';

const LlmsButton = ({ sx }: { sx?: object }) => (
  <Button
    component='a'
    href={LLMS_TXT}
    size='small'
    variant='outlined'
    startIcon={<AutoAwesomeIcon />}
    sx={{
      color: 'common.white',
      borderColor: 'rgba(255, 255, 255, 0.6)',
      whiteSpace: 'nowrap',
      '&:hover': { borderColor: 'common.white', bgcolor: 'rgba(255, 255, 255, 0.1)' },
      ...sx,
    }}
  >
    Use with LLMs
  </Button>
);

const SectionNav = ({ items }: { items: SectionNavItem[] }) => {
  const pathname = withSlash(usePathname() ?? '/');
  const [mobileOpen, setMobileOpen] = useState(false);
  const atHome = pathname === HOME;

  const isActive = (item: SectionNavItem) =>
    withSlash(item.path) === pathname ||
    !!item.children?.some((c) => !isExternal(c.path) && withSlash(c.path) === pathname);

  return (
    <Box
      component='nav'
      aria-label='Campus Computing'
      data-pagefind-ignore
      sx={{
        position: 'sticky',
        top: HEADER_HEIGHT,
        // Under the site header's dropdowns, above the page's sticky columns.
        zIndex: (theme) => theme.zIndex.appBar - 1,
        minHeight: SECTION_NAV_HEIGHT,
        bgcolor: 'primary.main',
        color: 'common.white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}
    >
      <Container maxWidth='lg'>
        {/* Desktop */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* The section title doubles as the link to the section home, which has no menu entry of its own. */}
          <Link
            component={NextLink}
            href={HOME}
            underline='hover'
            aria-current={atHome ? 'page' : undefined}
            sx={{
              fontWeight: 700,
              color: 'common.white',
              opacity: atHome ? 1 : 0.9,
              mr: 2,
              fontSize: '0.95rem',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              '&:hover': { opacity: 1 },
            }}
          >
            Campus Computing
          </Link>
          {items.map((item) =>
            item.children?.length ? (
              <DropdownItem key={item.label} item={item} active={isActive(item)} />
            ) : (
              <Button key={item.label} href={item.path} sx={navButtonSx(isActive(item))}>
                {item.label}
              </Button>
            )
          )}
          <LlmsButton sx={{ ml: 'auto', my: 0.75 }} />
        </Box>

        {/* Phone */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
            <Link
              component={NextLink}
              href={HOME}
              underline='hover'
              aria-current={atHome ? 'page' : undefined}
              sx={{ fontWeight: 700, color: 'common.white', py: 1, flexGrow: 1 }}
            >
              Campus Computing
            </Link>
            <IconButton
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close section menu' : 'Open section menu'}
              sx={{ color: 'common.white' }}
            >
              <MenuIcon />
              <KeyboardArrowDownIcon fontSize='small' sx={{ transform: mobileOpen ? 'rotate(180deg)' : 'none' }} />
            </IconButton>
          </Box>
          <Collapse in={mobileOpen}>
            <List dense sx={{ pb: 1, '& .MuiListItemButton-root': { color: 'common.white' } }}>
              {items.map((item) => (
                <Box key={item.label}>
                  <ListItemButton
                    component={NextLink}
                    href={item.path}
                    selected={withSlash(item.path) === pathname}
                    onClick={() => setMobileOpen(false)}
                  >
                    <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontWeight: 600 } } }} />
                  </ListItemButton>
                  {item.children?.map((child) => (
                    <ListItemButton
                      key={child.path}
                      component={isExternal(child.path) ? 'a' : NextLink}
                      href={child.path}
                      sx={{ pl: 4 }}
                      onClick={() => setMobileOpen(false)}
                    >
                      <ListItemText primary={child.label} />
                    </ListItemButton>
                  ))}
                </Box>
              ))}
              <Box sx={{ px: 2, pt: 1 }}>
                <LlmsButton />
              </Box>
            </List>
          </Collapse>
        </Box>
      </Container>
    </Box>
  );
};

export default SectionNav;
