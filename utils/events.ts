import {
  filterEvents,
  getEvents,
  type BackendEvent,
} from '@chtc/web-components/content';
import {
  extractMarkdownImageUrls,
  recordRemoteImages,
} from '@/utils/remoteImages';

const ORGANIZATION = 'CHTC';
const REPOSITORY = 'events';
const BRANCH = 'main';

/**
 * The events this site publishes.
 *
 * Everything about an event other than which site shows it lives in the
 * library; what is left here is the `chtc` filter and declaring the art to
 * the export image optimizer. Every page that shows events goes through this
 * function, so it is the one place that sees the whole set.
 */
export async function getSiteEvents(): Promise<BackendEvent[]> {
  const onChtc = filterEvents(
    await getEvents(ORGANIZATION, REPOSITORY, BRANCH),
    'chtc'
  );

  // See remoteImages.ts: an image the optimizer is not told about is left at
  // its original size and fetched from the content repository on every view.
  recordRemoteImages(
    onChtc.flatMap((event) => [
      event.image?.path,
      event.banner?.path,
      ...extractMarkdownImageUrls(event.content, event.sidebar, event.endblock),
    ])
  );

  return onChtc;
}
