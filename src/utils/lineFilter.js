import { safeParseArrayJson } from './helpers'

/**
 * Metni satırlara bölüp verilen terimlerden en az birini içeren satırları döndürür.
 * @param {string} text - Newline ile ayrılmış metin
 * @param {string[]} terms - Arama terimleri (boş olanlar elenir)
 * @param {{ logToConsole?: boolean }} options - logToConsole true ise eşleşen satırlar (JSON parse edilerek) konsola yazdırılır
 * @returns {string} Filtrelenmiş satırlar, newline ile birleştirilmiş
 */
export function filterLinesByTerms(text, terms, options = {}) {
  const validTerms = terms.filter(Boolean)
  if (validTerms.length === 0) return text

  const lines = text.split('\n')
  const filteredLines = lines.filter((line) => validTerms.every((term) => line.includes(term)))

  if (options.logToConsole && filteredLines.length > 0) {
    const parsed = safeParseArrayJson(filteredLines)
    if (parsed) console.log(parsed)
  }

  return filteredLines.length ? filteredLines.join('\n') + '\n' : ''
}
