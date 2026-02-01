import { Readable } from 'stream'
import zlib from 'zlib'
import tar from 'tar-stream'
import { pipeline } from 'stream/promises'
import { filterLinesByTerms } from './lineFilter.js'

const LOG_EXT = '.log'

/**
 * Extract .log files from a tar.gz buffer and filter their lines by terms.
 * @param {Buffer} tgzBuffer - tar.gz file content
 * @param {string[]} terms - Filter terms (line must include all)
 * @param {object} [options] - { logToConsole: boolean }
 * @returns {{ text: string, logFileCount: number }}
 */
function extractAndFilterTarGz(tgzBuffer, terms, options = {}) {
  return new Promise((resolve, reject) => {
    const parts = []
    let logFileCount = 0
    const extract = tar.extract()

    extract.on('entry', (header, stream, next) => {
      const name = (header.name || '').replace(/\\/g, '/')
      const isLog =
        header.type === 'file' &&
        name.toLowerCase().endsWith(LOG_EXT)

      if (!isLog) {
        stream.resume()
        return next()
      }

      const chunks = []
      stream.on('data', (chunk) => chunks.push(chunk))
      stream.on('end', () => {
        const content = Buffer.concat(chunks).toString('utf8')
        const filtered = filterLinesByTerms(content, terms, options)
        if (filtered) {
          parts.push(filtered)
          logFileCount += 1
        }
        next()
      })
      stream.on('error', (err) => {
        stream.resume()
        next(err)
      })
    })

    extract.on('finish', () => {
      resolve({
        text: parts.join('\n'),
        logFileCount,
      })
    })
    extract.on('error', reject)

    const readable = Readable.from(tgzBuffer)
    pipeline(
      readable,
      zlib.createGunzip(),
      extract
    ).catch(reject)
  })
}

async function filterTarGzFiles(tgzBuffers, terms, options = {}) {
  const validTerms = terms.map((t) => t.trim()).filter(Boolean)
  const allParts = []
  let totalLogFiles = 0
  const collectParsed = options.logToConsole ? [] : null
  const opts = collectParsed ? { ...options, collectParsed } : options

  for (const buf of tgzBuffers) {
    const { text, logFileCount } = await extractAndFilterTarGz(buf, validTerms, opts)
    if (text) allParts.push(text)
    totalLogFiles += logFileCount
  }

  return {
    text: allParts.join('\n'),
    totalLogFiles,
    logData: collectParsed,
  }
}

export { extractAndFilterTarGz, filterTarGzFiles }
