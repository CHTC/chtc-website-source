'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import GuideIcon from './GuideIcon';
import type { GuideMenu, MenuLink, MenuSection } from './GuideSidebar.types';

export interface GuideSidebarProps {
  menus: GuideMenu[];
}

/** Paths compare without fragment and with a trailing slash. */
const pagePath = (url: string | undefined) => {
  if (!url) return undefined;
  const bare = url.split('#')[0];
  return bare.endsWith('/') ? bare : `${bare}/`;
};

const isExternal = (url: string) => /^[a-z]+:/i.test(url);

function contains(links: MenuLink[] | undefined, current: string): boolean {
  return !!links?.some(
    (link) => pagePath(link.url) === current || contains(link.links, current)
  );
}

const MenuLinks = ({
  links,
  current,
  depth,
}: {
  links: MenuLink[];
  current: string;
  depth: number;
}) => (
  <List disablePadding dense>
    {links.map((link, index) => {
      const active = !!link.url && pagePath(link.url) === current && !link.url.includes('#');
      const indent = 2 + depth * 1.5;
      return (
        <Box component='li' key={`${link.text}-${index}`} sx={{ listStyle: 'none' }}>
          {link.url ? (
            <ListItemButton
              component={isExternal(link.url) ? 'a' : NextLink}
              href={link.url}
              selected={active}
              aria-current={active ? 'page' : undefined}
              sx={{
                pl: indent,
                py: 0.5,
                borderLeft: '3px solid',
                borderColor: active ? 'primary.main' : 'transparent',
                ...(link.highlight ? { bgcolor: 'warning.light' } : {}),
              }}
            >
              {link.icon && (
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <GuideIcon name={link.icon} fontSize='small' />
                </ListItemIcon>
              )}
              <ListItemText
                primary={link.text}
                slotProps={{
                  primary: {
                    sx: { fontSize: '0.875rem', fontWeight: active ? 700 : 400 },
                  },
                }}
              />
            </ListItemButton>
          ) : (
            <Box
              sx={{
                pl: indent,
                pr: 1,
                py: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.secondary',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              <FolderOutlinedIcon sx={{ fontSize: '1rem' }} />
              {link.text}
            </Box>
          )}
          {link.links && link.links.length > 0 && (
            <Box sx={{ ml: indent - 1, borderLeft: 1, borderColor: 'divider' }}>
              <MenuLinks links={link.links} current={current} depth={0} />
            </Box>
          )}
        </Box>
      );
    })}
  </List>
);

const Section = ({ section, current }: { section: MenuSection; current: string }) => {
  const [open, setOpen] = useState(() => contains(section.links, current));
  return (
    <Box component='li' sx={{ listStyle: 'none' }}>
      <ListItemButton onClick={() => setOpen((o) => !o)} aria-expanded={open} sx={{ py: 0.75 }}>
        {section.icon && (
          <ListItemIcon sx={{ minWidth: 32 }}>
            <GuideIcon name={section.icon} fontSize='small' />
          </ListItemIcon>
        )}
        <ListItemText
          primary={section.text}
          slotProps={{ primary: { sx: { fontWeight: 600, fontSize: '0.95rem' } } }}
        />
        {open ? <ExpandLess fontSize='small' /> : <ExpandMore fontSize='small' />}
      </ListItemButton>
      <Collapse in={open} timeout='auto' unmountOnExit={false}>
        <MenuLinks links={section.links} current={current} depth={0} />
      </Collapse>
    </Box>
  );
};

/**
 * The guide sidebar from the legacy `_includes/guide-sidebar.liquid`: one
 * collapsible group per menu section, the group holding the current page
 * opened and the page itself highlighted.
 */
const GuideSidebar = ({ menus }: GuideSidebarProps) => {
  const pathname = usePathname() ?? '';
  const current = pagePath(pathname) ?? '';

  return (
    <Box component='nav' aria-label='Guides'>
      {menus.map((menu) => (
        <Box key={menu.title} sx={{ mb: 3 }}>
          <Typography
            component='h2'
            variant='overline'
            sx={{ display: 'block', px: 2, color: 'text.secondary', fontWeight: 700 }}
          >
            {menu.title}
          </Typography>
          <List disablePadding>
            {menu.sections.map((section) => (
              <Section key={section.text} section={section} current={current} />
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default GuideSidebar;
