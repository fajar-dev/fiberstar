/**
 * Ubah string menjadi Title Case.
 */
export function toTitleCase(str: string): string {
  const romanRegex = /^(?=[MDCLXVI])(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3}))$/i

  return str
    .split(/\s+/)
    .map(word => {
      if (romanRegex.test(word.toUpperCase())) {
        return word.toUpperCase()
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(" ")
}
