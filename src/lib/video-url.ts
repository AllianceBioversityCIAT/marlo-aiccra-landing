/** Resolve a video filename to a full URL (S3/CloudFront) or local /videos/ path. */
export function resolveVideoSrc(filename: string, baseUrl?: string): string {
  const name = filename.replace(/^\/videos\//, '');

  if (baseUrl?.trim()) {
    return `${baseUrl.replace(/\/$/, '')}/${name}`;
  }

  return `/videos/${name}`;
}
