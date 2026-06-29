export function splitKeywords(value?: string | string[]): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return value
    .split(/[;,/|\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function includesAny(text: string | undefined, keywords: string[]): boolean {
  if (!text) return false;
  const normalized = text.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
}

export function uniq<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

export function normalizeSpace(value?: string): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}
