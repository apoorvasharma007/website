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
    description:
      'Knowledge bases on AI, system design and coding, plus projects, demos, tutorials and blog posts.',
  },
  {
    side: 'fit',
    word: 'Fitness',
    href: '/fitness/',
    description:
      'Knowledge bases on training, nutrition and programming, plus programs and my live dashboard.',
  },
  {
    side: 'blog',
    word: 'Blog',
    href: '/blog/',
    description: 'Posts from both sides.',
  },
] as const;
