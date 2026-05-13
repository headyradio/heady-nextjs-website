export interface MixcloudPictures {
  small: string;
  thumbnail: string;
  medium: string;
  large: string;
  extra_large: string;
  '320wx320h': string;
  '640wx640h': string;
  '768wx768h': string;
  '1024wx1024h': string;
}

export interface MixcloudCloudcast {
  key: string;
  url: string;
  name: string;
  slug: string;
  tags: { name: string; slug: string }[];
  created_time: string;
  audio_length: number;
  play_count: number;
  favorite_count: number;
  listener_count: number;
  pictures: MixcloudPictures;
  user: { username: string; name: string };
  description?: string;
}

export interface MixcloudTrackSection {
  id: string;
  startSeconds: number;
  artistName: string;
  songName: string;
}

export type CloudcastCategory = 'SHOW' | 'MIXTAPE';

export interface ClassifiedCloudcast extends MixcloudCloudcast {
  category: CloudcastCategory;
  genre?: string;
}
