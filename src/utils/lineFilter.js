import { safeParseArrayJson } from './helpers'

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
