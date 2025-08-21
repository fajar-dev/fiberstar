/**
 * Bersihkan string dari karakter tersembunyi & whitespace berlebihan
 * - \u200B : Zero Width Space
 * - \u200C : Zero Width Non-Joiner
 * - \u200D : Zero Width Joiner
 * - \uFEFF : Zero Width No-Break Space
 * - \u00A0 : Non-breaking space
 */
export function sanitizeString(str: string | null | undefined): string | null {
  if (!str) return str ?? null
  return str.replace(/[\u200B\u200C\u200D\uFEFF\u00A0]/g, '').trim()
}
