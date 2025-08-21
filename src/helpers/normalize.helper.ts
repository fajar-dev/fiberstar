
/**
 * Ubah "null" (string) menjadi null (tipe null asli).
 * Juga bisa dipakai bareng sanitizer lain.
 */
export function normalizeNull(value: any): any {
  if (value === undefined || value === null) return null

  if (typeof value === 'string') {
    const trimmed = value.trim().toLowerCase()
    if (trimmed === 'null' || trimmed === '' || trimmed === 'undefined') {
      return null
    }
    return value
  }

  return value
}


