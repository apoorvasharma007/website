// Captions are Apoorva's own wording (2026-10-16).
export const heroScenes = [
  {
    side: 'tech',
    lead: 'I like',
    phrase: 'Building Tech',
    caption: 'Cloud backends, AI agents, DevOps, mobile apps and a smaller cloud bill to name a few.',
    art: '/art/whack-a-bug.svg',
  },
  {
    side: 'fit',
    lead: 'I love',
    phrase: 'Working Out',
    caption: 'Squats, pull-ups, rings, wrestling and a lot of falling over.',
    art: '/art/clean-and-jerk.svg',
  },
] as const;

export const sideRows = [
  {
    side: 'tech',
    word: 'Tech',
    href: '/tech/',
    description: 'Software, AI, projects and tutorials. Hop on for the ride.',
  },
  {
    side: 'fit',
    word: 'Fitness',
    href: '/fitness/',
    description: 'Getting freakishly strong, fast, bendy, jumpy and flippy, and moving like the wind.',
  },
  {
    side: 'blog',
    word: 'Blog',
    href: '/blog/',
    description: 'Posts from both sides.',
  },
] as const;
