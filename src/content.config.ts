import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const pageTypes = [
  'Knowledge Base',
  'Project',
  'Demo',
  'Tutorial',
  'Program',
  'Blog',
] as const;

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    side: z.enum(['tech', 'fit']),
    type: z.enum(pageTypes),
    parent: z.string().optional(),
    order: z.number().default(0),
    description: z.string(),
    date: z.coerce.date(),
    status: z.enum(['Draft', 'Published']).default('Published'),
    sourceUrl: z.url().optional(),
    docsUrl: z.url().optional(),
    liveUrl: z.url().optional(),
    sources: z.array(z.object({ title: z.string(), url: z.url(), note: z.string().optional() })).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { pages };
