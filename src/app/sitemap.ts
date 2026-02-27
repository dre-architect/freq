import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://freqai.io', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://freqai.io/platform', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://freqai.io/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://freqai.io/team', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://freqai.io/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://freqai.io/solutions/barge-drafting', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]
}
