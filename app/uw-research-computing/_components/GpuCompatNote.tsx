import { Fragment } from 'react';
import { Link } from '@mui/material';

const URL_PATTERN = /(https?:\/\/[^\s)]+)/;

/**
 * A note from `data/compat.yaml` as text, with any URL in it made a link.
 * Used by both the `GpuCompatPicker` alerts and the `GpuCompatTable` cells.
 */
const GpuCompatNote = ({ note }: { note: string }) => (
  <>
    {note.split(URL_PATTERN).map((part, index) =>
      // split() with a capture group puts the URLs at the odd indices.
      index % 2 ? (
        <Link key={index} href={part}>
          {part}
        </Link>
      ) : (
        <Fragment key={index}>{part}</Fragment>
      )
    )}
  </>
);

export default GpuCompatNote;
