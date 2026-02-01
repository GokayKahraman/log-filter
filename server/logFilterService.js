import { filterLinesByTerms } from './lineFilter.js'

/**
 * Filter plain log file buffers by terms.
 * @param {Buffer[]} logBuffers - Log file contents (UTF-8)
 * @param {string[]} terms - Filter terms (line must include all)
 * @param {object} [options] - { logToConsole: boolean }
 * @returns {{ text: string, logData: any[] | null }}
 */
function filterLogFiles(logBuffers, terms, options = {}) {
  const validTerms = terms.map((t) => t.trim()).filter(Boolean)
  const collectParsed = options.logToConsole ? [] : null
  const opts = collectParsed ? { ...options, collectParsed } : options
  const parts = []

  for (const buf of logBuffers) {
    const content = buf.toString('utf8')
    const filtered = filterLinesByTerms(content, validTerms, opts)
    if (filtered) parts.push(filtered)
  }

  return {
    text: parts.join('\n'),
    logData: collectParsed,
  }
}

export { filterLogFiles }
