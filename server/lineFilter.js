import { safeParseArrayJson } from './helpers.js'

function filterLinesByTerms(text, terms, options = {}) {
  const validTerms = terms.filter(Boolean)
  if (validTerms.length === 0) return text

  const lines = text.split('\n')
  const filtered = lines.filter((line) =>
    validTerms.every((term) => line.includes(term))
  )

  if (options.logToConsole && filtered.length > 0) {
    const parsed = safeParseArrayJson(filtered)
    if (parsed) {
      if (Array.isArray(options.collectParsed)) {
        options.collectParsed.push(...parsed)
      } else {
        console.log(parsed)
      }
    }
  }

  return filtered.length ? filtered.join('\n') + '\n' : ''
}

export { filterLinesByTerms }
