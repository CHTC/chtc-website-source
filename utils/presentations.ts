import {
  filterPresentations,
  getPresentations,
  type BackendPresentation,
} from '@chtc/web-components/content';
import { recordRemoteImages } from '@/utils/remoteImages';

const ORGANIZATION = 'CHTC';
const REPOSITORY = 'Presentations';
const BRANCH = 'main';

/**
 * The presentations this site publishes, as the library orders them.
 *
 * What is left here is the `chtc` filter and declaring the thumbnails to the
 * export image optimizer (see remoteImages.ts).
 */
export async function getSitePresentations(): Promise<BackendPresentation[]> {
  const onChtc = filterPresentations(
    await getPresentations(ORGANIZATION, REPOSITORY, BRANCH),
    'chtc'
  );

  recordRemoteImages(onChtc.map((presentation) => presentation.thumbnail?.src));

  return onChtc;
}

/** One presentation by the slug its page was generated for. */
export async function getSitePresentation(
  slug: string[]
): Promise<BackendPresentation | undefined> {
  const presentations = await getSitePresentations();
  const key = slug.join('/');
  return presentations.find((presentation) => presentation.slug.join('/') === key);
}
