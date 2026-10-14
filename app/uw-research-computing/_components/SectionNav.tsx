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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import type { SectionNavItem } from '../_lib/docs';

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
  color: active ? 'primary.main' : 'text.primary',
  fontWeight: active ? 700 : 500,
  borderRadius: 0,
  borderBottom: '3px solid',
  borderColor: active ? 'primary.main' : 'transparent',
  py: 1.25,
  px: 1.5,
  whiteSpace: 'nowrap',
});

/**
 * The UW Research Computing sub-navigation from the legacy
 * `_includes/navbar/uw-research-computing-navbar.html`, fed by
 * `_data/uw-research-computing-menu.yml`. Sits under the global header on
 * every page of the section.
 */
const HOME = '/uw-research-computing/';

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
      aria-label='UW Research Computing'
      sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
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
              color: atHome ? 'primary.main' : 'text.secondary',
              mr: 2,
              fontSize: '0.9rem',
              '&:hover': { color: 'primary.main' },
            }}
          >
            UW Research Computing
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
        </Box>

        {/* Phone */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
            <Link
              component={NextLink}
              href={HOME}
              underline='hover'
              aria-current={atHome ? 'page' : undefined}
              sx={{ fontWeight: 700, color: atHome ? 'primary.main' : 'text.primary', py: 1, flexGrow: 1 }}
            >
              UW Research Computing
            </Link>
            <IconButton
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close section menu' : 'Open section menu'}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
              <KeyboardArrowDownIcon fontSize='small' sx={{ transform: mobileOpen ? 'rotate(180deg)' : 'none' }} />
            </IconButton>
          </Box>
          <Collapse in={mobileOpen}>
            <List dense sx={{ pb: 1 }}>
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
            </List>
          </Collapse>
        </Box>
      </Container>
    </Box>
  );
};

export default SectionNav;
