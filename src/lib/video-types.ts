export type VideoType = 'all' | 'shorts' | 'videos';

export function getKindsForType(type: VideoType): number[] {
  switch (type) {
    case 'shorts':
      return [34236, 22];
    case 'videos':
      return [34235, 21];
    default:
      return [34235, 34236, 21, 22];
  }
} 