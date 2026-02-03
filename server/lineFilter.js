import { safeParseArrayJson } from './helpers.js'

/** Tek satırın tüm terimleri içerip içermediğini kontrol eder (streaming için). */
function lineMatchesTerms(line, terms) {
  if (!terms || terms.length === 0) return true
  return terms.every((term) => line.includes(term))
}

function filterLinesByTerms(text, terms, options = {}) {
  const validTerms = terms.filter(Boolean)
  if (validTerms.length === 0) return text

  const lines = text.split('\n')
  const filtered = lines.filter((line) =>
    validTerms.every((term) => line.includes(term))
  )

  if (options.logToConsole && filtered.length > 0) {
    const parsed = safeParseArrayJson(filtered)
    if (parsed && Array.isArray(options.collectParsed)) {
      options.collectParsed.push(...parsed)
    }
  }

  return filtered.length ? filtered.join('\n') + '\n' : ''
}

export { filterLinesByTerms, lineMatchesTerms }
