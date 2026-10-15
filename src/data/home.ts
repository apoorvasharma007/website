// Placeholder copy: captions are not final (2026-10-15). Edit here only.
export const heroScenes = [
  {
    side: 'tech',
    lead: 'I like',
    phrase: 'Building Tech',
    caption: 'I build the software that shows where the cloud money goes.',
    art: '/art/whack-a-bug.svg',
  },
  {
    side: 'fit',
    lead: 'I love',
    phrase: 'Beating Gravity',
    caption: 'I train the body that carries the laptop.',
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
