export const site = {
  name: 'Apoorva Sharma',
  url: 'https://apoorvasharma7.com',
  description:
    'Apoorva Sharma builds cloud software and trains movement. Knowledge bases, projects, programs and blog posts on both.',
  resume: '/resume.pdf',
  youtube: 'https://www.youtube.com',
  instagram: 'https://www.instagram.com',
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
