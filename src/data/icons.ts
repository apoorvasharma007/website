export const icons = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  youtube: '<rect x="3" y="5.5" width="18" height="13" rx="4"/><path d="M10.5 9.5l4 2.5-4 2.5z"/>',
  instagram: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><path d="M16.8 7.2h.01"/>',
  github: '<path d="M9 19c-4 1-4-2-6-2m12 4v-3a3 3 0 0 0-1-2c3 0 6-2 6-5a5 5 0 0 0-1-3 5 5 0 0 0 0-3s-1 0-3 1a10 10 0 0 0-6 0c-2-1-3-1-3-1a5 5 0 0 0 0 3 5 5 0 0 0-1 3c0 3 3 5 6 5a3 3 0 0 0-1 2v3"/>',
} as const;

export type IconName = keyof typeof icons;
