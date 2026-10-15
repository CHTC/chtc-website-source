import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { listingMetadata } from '@/utils/metadata';
import DocBody from '../_components/DocBody';
import DocLayout from '../_components/DocLayout';
import { docHeadings, getDoc, getDocs, sidebarMenus } from '../_lib/docs';

type Params = Promise<{ slug: string[] }>;

/** One static page per converted document in content/uw-research-computing/docs. */
export function generateStaticParams() {
  return getDocs().map((doc) => ({ slug: doc.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const doc = getDoc((await params).slug);
  if (!doc) return {};
  const metadata = listingMetadata(doc.data.title, doc.data.description, doc.path);
  return doc.data.noindex ? { ...metadata, robots: { index: false, follow: false } } : metadata;
}

export default async function Page({ params }: { params: Params }) {
  const doc = getDoc((await params).slug);
  if (!doc) notFound();

  return (
    <DocLayout
      title={doc.data.title}
      width={doc.data.width}
      menus={sidebarMenus(doc)}
      headings={docHeadings(doc)}
    >
      <DocBody doc={doc} />
    </DocLayout>
  );
}
