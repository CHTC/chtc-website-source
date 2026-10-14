// Phase-2 gate: prints what the content getters return for this site.
// Run with `npx tsx scripts/check-content.mts`.
import { getArticles } from '@chtc/web-components/content';
import { getSiteArticles } from '../utils/articles';
import { getSiteEvents } from '../utils/events';
import { getSitePresentations } from '../utils/presentations';
import { getStaff } from '../utils/staff';


const all = await getArticles('CHTC', 'Articles', 'main');
const articles = await getSiteArticles();
const news = articles.filter((a) => a.type === 'news');
const user = articles.filter((a) => a.type === 'user');
const events = await getSiteEvents();
const presentations = await getSitePresentations();
const staff = await getStaff('chtc');

console.log(`articles total in repo: ${all.length}`);
console.log(`articles on chtc: ${articles.length} (news ${news.length}, user ${user.length}, other ${articles.length - news.length - user.length})`);
console.log(`events on chtc: ${events.length}`);
console.log(`presentations on chtc: ${presentations.length}`);
console.log(`staff (all): ${staff.length}; with organizations incl. chtc: ${staff.filter((s) => s.organizations?.includes('chtc')).length}; yaml-filed: ${staff.filter((s) => /\.yaml$/.test(String((s as unknown as { path?: string }).path ?? ''))).length}`);
console.log('sample article slug:', articles[0]?.slug, 'type', articles[0]?.type);
console.log('sample event slug:', events[0]?.slug);
console.log('sample presentation slug:', presentations[0]?.slug);
