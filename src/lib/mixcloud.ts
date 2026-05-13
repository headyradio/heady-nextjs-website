import type {
  MixcloudCloudcast,
  MixcloudTrackSection,
  ClassifiedCloudcast,
  CloudcastCategory,
} from '@/types/mixcloud';

export async function fetchCloudcasts(): Promise<MixcloudCloudcast[]> {
  const res = await fetch(
    'https://api.mixcloud.com/headyradio/cloudcasts/?limit=50',
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to fetch cloudcasts');
  const data = await res.json();
  return data.data ?? [];
}

export async function fetchCloudcastDetail(key: string): Promise<MixcloudCloudcast> {
  const res = await fetch(`https://api.mixcloud.com${key}`);
  if (!res.ok) throw new Error('Failed to fetch cloudcast detail');
  return res.json();
}

export async function fetchTracklist(slug: string): Promise<MixcloudTrackSection[]> {
  try {
    const res = await fetch('https://app.mixcloud.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{ cloudcastLookup(lookup: {username: "headyradio", slug: "${slug}"}) { sections { __typename ... on TrackSection { id startSeconds artistName songName } } } }`,
      }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (
      data.data?.cloudcastLookup?.sections?.filter(
        (s: { __typename: string }) => s.__typename === 'TrackSection'
      ) ?? []
    );
  } catch {
    return [];
  }
}

export function classifyCloudcast(cloudcast: MixcloudCloudcast): ClassifiedCloudcast {
  const name = cloudcast.name.toUpperCase();
  let category: CloudcastCategory = 'MIXTAPE';
  let genre: string | undefined;

  if (name.includes('NIGHT TREATS') || name.includes('JOHAN') || name.includes('LYAH')) {
    category = 'SHOW';
    genre = name.includes('NIGHT TREATS') ? 'Electronic' : 'Alt Rock & Indie';
  }

  return { ...cloudcast, category, genre };
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
