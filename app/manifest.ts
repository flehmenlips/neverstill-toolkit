import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Neverstill Operator Toolkit',
    short_name: 'Neverstill',
    description:
      'Practical micro-tools for farmers, chefs, and families. PaperAirplane printables, FarmForge forecasting, and more.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#09090b',
    theme_color: '#09090b',
    categories: ['education', 'productivity', 'utilities'],
    icons: [
      {
        src: '/icons/192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'PaperAirplane Mazes',
        short_name: 'Mazes',
        url: '/tools/paperairplane/pwa',
        description: 'Generate printable mazes with difficulty presets and PDF export.',
      },
      {
        name: 'Shop Packs',
        short_name: 'Shop',
        url: '/tools/paperairplane',
        description: 'PaperAirplane packs and Pro access.',
      },
    ],
  };
}
