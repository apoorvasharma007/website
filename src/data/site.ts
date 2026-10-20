export const site = {
  name: 'Apoorva Sharma',
  url: 'https://apoorvasharma7.com',
  description:
    'Apoorva Sharma. Software engineering and gym stuff. Projects, articles, and notes so future me stops googling the same things.',
  email: 'apoorva.c.sharma@gmail.com',
  resume: '/resume.pdf',
  youtube: 'https://www.youtube.com/@apoorvasharma.7',
  instagram: 'https://www.instagram.com/apoorvasharma.7',
  github: 'https://github.com/apoorvasharma007',
  dashboard: 'https://apoorvasharma007.github.io/traininglogs/',
} as const;

export const nav = [
  { label: 'Tech', href: '/tech/' },
  { label: 'Fitness', href: '/fitness/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'About', href: '/about/', secondary: true },
  { label: 'Contact', href: '/contact/', secondary: true },
] as const;
