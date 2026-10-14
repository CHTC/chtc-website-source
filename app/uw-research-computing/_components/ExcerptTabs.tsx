'use client';

import { useState, type ReactNode } from 'react';
import { Box, Link, Paper, Tab, Tabs } from '@mui/material';

export interface ExcerptTab {
  id: string;
  label: string;
  icon?: string;
  /** "More information" target, when the tab summarises another page. */
  href?: string;
}

/**
 * The software / language picker from the legacy software overview and
 * basic-scripting guides (`assets/js/pages/software-overview.js`): one tab per
 * document, showing that document's excerpt. The panels are rendered on the
 * server and passed in; every panel stays in the HTML (hidden when not
 * selected) so the content is there without JavaScript.
 */
const ExcerptTabs = ({ tabs, panels }: { tabs: ExcerptTab[]; panels: ReactNode[] }) => {
  const [selected, setSelected] = useState(0);

  return (
    <Paper variant='outlined' sx={{ my: 3, overflow: 'hidden' }}>
      <Tabs
        value={selected}
        onChange={(_, value: number) => setSelected(value)}
        variant='scrollable'
        scrollButtons='auto'
        allowScrollButtonsMobile
        aria-label='Choose a language or program'
        sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={tab.id}
            id={`excerpt-tab-${tab.id}`}
            aria-controls={`excerpt-panel-${tab.id}`}
            value={index}
            label={tab.label}
            iconPosition='top'
            icon={
              tab.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tab.icon} alt='' style={{ height: 36, width: 'auto' }} />
              ) : undefined
            }
            sx={{ textTransform: 'none', fontWeight: 600, minWidth: 96 }}
          />
        ))}
      </Tabs>
      {tabs.map((tab, index) => (
        <Box
          key={tab.id}
          role='tabpanel'
          id={`excerpt-panel-${tab.id}`}
          aria-labelledby={`excerpt-tab-${tab.id}`}
          hidden={selected !== index}
          sx={{ p: { xs: 2, md: 3 } }}
        >
          {panels[index]}
          {tab.href && (
            <Link href={tab.href} sx={{ fontWeight: 700 }}>
              More information
            </Link>
          )}
        </Box>
      ))}
    </Paper>
  );
};

export default ExcerptTabs;
