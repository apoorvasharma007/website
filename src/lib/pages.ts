import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../data/site';

export type Page = CollectionEntry<'pages'>;
export type Side = Page['data']['side'];

export interface TreeItem {
  label: string;
  href?: string;
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
    { label: 'Projects', blurb: 'traininglogs, this website and what comes next.', type: 'Project' },
    { label: 'Demos', blurb: 'Small things you can run in the page.', type: 'Demo' },
    { label: 'Tutorials', blurb: 'Step by step, from nothing to working.', type: 'Tutorial' },
    { label: 'Articles', blurb: 'Notes on building and operating systems.', type: 'Article' },
  ],
  fit: [
    { label: 'Knowledge Base', blurb: 'Training, Nutrition and Programming.', type: 'Knowledge Base' },
    { label: 'Programs', blurb: 'Protocols and plans, with sources.', type: 'Program' },
    { label: 'Dashboard', blurb: 'Live training data, straight from traininglogs.', href: site.dashboard },
    { label: 'Articles', blurb: 'What I tried, and what held up.', type: 'Article' },
  ],
};

const bySequence = (a: Page, b: Page) =>
  a.data.order - b.data.order || a.data.date.getTime() - b.data.date.getTime();

export async function getPublished() {
  const all = await getCollection('pages', ({ data }) => data.status === 'Published');
  return all.sort(bySequence);
}

export const pageUrl = (page: Page) => `/${page.id}/`;

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
    const roots = pages.filter((p) => p.data.side === side && p.data.type === group.type && !p.data.parent);
    return { label: group.label, soon: roots.length === 0, children: roots.map((p) => nodeOf(pages, p)) };
  });
  return { label, children: [overview, ...groupNodes] };
}

export function overviewRows(pages: Page[], side: Side) {
  return groups[side].map(({ label, blurb, type, href }) => {
    const first = pages.find((p) => p.data.side === side && p.data.type === type && !p.data.parent);
    return { label, blurb, href: href ?? (first && pageUrl(first)), external: Boolean(href) };
  });
}

export const holds = (node: TreeItem, href: string): boolean =>
  node.href === href || node.children.some((child) => holds(child, href));

export function crumbsOf(pages: Page[], page: Page) {
  const trail: { label: string; href?: string }[] = [];
  for (let at: Page | undefined = page; at; at = pages.find((p) => p.id === at!.data.parent)) {
    trail.unshift({ label: at.data.title, href: at === page ? undefined : pageUrl(at) });
  }
  const group = groups[page.data.side].find((g) => g.type === page.data.type)!;
  return [{ label: sides[page.data.side].label, href: `/${sides[page.data.side].dir}/` }, { label: group.label }, ...trail];
}

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
