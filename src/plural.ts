/**
 * "1 path" / "3 paths". A count with a correctly pluralized noun.
 * The design language never ships programmer plurals like "1 finding(s)".
 */
export function plural(n: number, singular: string, pluralForm?: string): string {
  return `${n} ${n === 1 ? singular : (pluralForm ?? singular + 's')}`;
}
