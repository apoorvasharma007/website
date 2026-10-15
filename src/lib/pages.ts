import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../data/site';

export type Page = CollectionEntry<'pages'>;
export type Side = Page['data']['side'];

export interface TreeItem {
  label: string;
  href?: string;
  section?: string;
  external?: boolean;
  soon?: boolean;
  children: TreeItem[];
}

export const sides = {
  tech: {
    label: 'Tech',
    dir: 'tech',
    intro: 'Things I build, things I learn, and the notes I keep so I can build them again.',
  },
  fit: {
    label: 'Fitness',
    dir: 'fitness',
    intro:
      'Calisthenics, rings, strength, conditioning, juggling and reaction drills, and the theory behind them.',
  },
} as const;

const groups: Record<Side, { label: string; blurb: string; type?: Page['data']['type']; href?: string }[]> = {
  tech: [
    { label: 'Knowledge Base', blurb: 'AI, System Design and Coding.', type: 'Knowledge Base' },
    { label: 'Projects', blurb: 'traininglogs and this website.', type: 'Project' },
    { label: 'Demos', blurb: 'Small things you can run in the page.', type: 'Demo' },
    { label: 'Tutorials', blurb: 'Step by step, from nothing to working.', type: 'Tutorial' },
    { label: 'Blog', blurb: 'Notes from building systems.', type: 'Blog' },
  ],
  fit: [
    { label: 'Knowledge Base', blurb: 'Training, Nutrition and Programming.', type: 'Knowledge Base' },
    { label: 'Programs', blurb: 'Protocols and plans, with sources.', type: 'Program' },
    { label: 'Dashboard', blurb: 'Live data from traininglogs.', href: site.dashboard },
    { label: 'Blog', blurb: 'What I tried, and what held up.', type: 'Blog' },
  ],
};

const bySequence = (a: Page, b: Page) =>
  a.data.order - b.data.order || a.data.date.getTime() - b.data.date.getTime();

const maxDepth = 2;

function checkDepth(pages: Page[]) {
  for (const page of pages) {
    let depth = 0;
    for (let at = page; at.data.parent; depth++) {
      const parent = pages.find((p) => p.id === at.data.parent);
      if (!parent) throw new Error(`${page.id}: parent "${at.data.parent}" is not a published page`);
      at = parent;
    }
    if (depth > maxDepth) {
      throw new Error(`${page.id} sits ${depth} levels under its first page. The limit is ${maxDepth} (book, section, chapter).`);
    }
  }
}

export async function getPublished() {
  const all = await getCollection('pages', ({ data }) => data.status === 'Published');
  checkDepth(all);
  return all.sort(bySequence);
}

export const pageUrl = (page: Page) => `/${page.id}/`;

export const blogUrl = (side: Side) => `/${sides[side].dir}/blog/`;

export const blogPosts = (pages: Page[], side?: Side) =>
  pages
    .filter((p) => p.data.type === 'Blog' && (!side || p.data.side === side))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

export const childrenOf = (pages: Page[], page: Page) =>
  pages.filter((p) => p.data.parent === page.id);

export function siblingsOf(pages: Page[], page: Page) {
  return pages.filter(
    (p) => p.data.parent === page.data.parent && p.data.side === page.data.side && p.data.type === page.data.type,
  );
}

function nodeOf(pages: Page[], page: Page): TreeItem {
  return {
    label: page.data.title,
    href: pageUrl(page),
    children: childrenOf(pages, page).map((child) => nodeOf(pages, child)),
  };
}

export function sideTree(pages: Page[], side: Side): TreeItem {
  const { label, dir } = sides[side];
  const overview: TreeItem = { label: 'Overview', href: `/${dir}/`, children: [] };
  const groupNodes = groups[side].map<TreeItem>((group) => {
    if (group.href) return { label: group.label, href: group.href, external: true, children: [] };
    if (group.type === 'Blog') {
      const posts = blogPosts(pages, side);
      return posts.length > 0
        ? { label: group.label, href: blogUrl(side), section: blogUrl(side), children: [] }
        : { label: group.label, soon: true, children: [] };
    }
    const roots = pages.filter((p) => p.data.side === side && p.data.type === group.type && !p.data.parent);
    return { label: group.label, soon: roots.length === 0, children: roots.map((p) => nodeOf(pages, p)) };
  });
  return { label, children: [overview, ...groupNodes] };
}

export function overviewRows(pages: Page[], side: Side) {
  return groups[side].map(({ label, blurb, type, href }) => {
    const first = pages.find((p) => p.data.side === side && p.data.type === type && !p.data.parent);
    const listed = type === 'Blog' ? first && blogUrl(side) : first && pageUrl(first);
    return { label, blurb, href: href ?? listed, external: Boolean(href) };
  });
}

export const holds = (node: TreeItem, href: string): boolean =>
  node.href === href ||
  Boolean(node.section && href.startsWith(node.section)) ||
  node.children.some((child) => holds(child, href));

export function crumbsOf(pages: Page[], page: Page) {
  const trail: { label: string; href?: string }[] = [];
  for (let at: Page | undefined = page; at; at = pages.find((p) => p.id === at!.data.parent)) {
    trail.unshift({ label: at.data.title, href: at === page ? undefined : pageUrl(at) });
  }
  const group = groups[page.data.side].find((g) => g.type === page.data.type)!;
  return [{ label: sides[page.data.side].label, href: `/${sides[page.data.side].dir}/` }, { label: group.label, href: group.type === 'Blog' ? blogUrl(page.data.side) : undefined }, ...trail];
}

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
