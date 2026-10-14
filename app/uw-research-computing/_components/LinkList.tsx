import { Container, Link, List, ListItem, Paper } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PageTitle from './PageTitle';

/**
 * The legacy "How To's" and "Other Resources" pages: a title and a short
 * side-nav list of links (the UW theme's `uw-side-nav`).
 */
const LinkList = ({ title, links }: { title: string; links: { text: string; url: string }[] }) => (
  <Container maxWidth='md'>
    <PageTitle>{title}</PageTitle>
    <Paper variant='outlined'>
      <List disablePadding>
        {links.map((link, index) => (
          <ListItem key={link.url} disablePadding divider={index < links.length - 1}>
            <Link
              href={link.url}
              underline='none'
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                px: 2.5,
                py: 1.75,
                fontWeight: 600,
                color: 'text.primary',
                '&:hover': { bgcolor: 'action.hover', color: 'primary.main' },
              }}
            >
              {link.text}
              <ChevronRightIcon color='action' />
            </Link>
          </ListItem>
        ))}
      </List>
    </Paper>
  </Container>
);

export default LinkList;
