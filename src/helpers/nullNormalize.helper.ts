/**
 * Ubah "null" (string), "undefined", atau string kosong menjadi null.
 */
export function normalizeNull(value: any): any {
  if (value === undefined || value === null) return null

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '' || /^null$/i.test(trimmed) || /^undefined$/i.test(trimmed)) {
      return null
    }
    return trimmed
  }

  return value
}
