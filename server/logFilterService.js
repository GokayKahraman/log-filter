import { StringDecoder } from 'node:string_decoder'
import { filterLinesByTerms, lineMatchesTerms } from './lineFilter.js'

// Okuma: buffer bu boyutta parça parça okunur (tek string 256MB limitini aşmasın).
const CHUNK_SIZE = 32 * 1024 * 1024 // 32MB
// Yazma: eşleşen satırlar bu kadar birikince res.write ile gönderilir (bellekte dev string birikmesin).
const OUT_FLUSH_SIZE = 1024 * 1024 // 1MB

/**
 * Buffer'ı satır satır işler, tek bir dev string oluşturmaz (0x1fffffe8 limitini aşmamak için).
 * Eşleşen satırları res'e yazar; logToConsole ise collectParsed doldurulur.
 */
function filterLogFilesStreaming(logBuffers, terms, res, options = {}) {
  const validTerms = terms.map((t) => t.trim()).filter(Boolean)
  const collectParsed = options.logToConsole ? [] : null
  const decoder = new StringDecoder('utf8')
  let tail = ''
  let outBuf = []

  function flushOut() {
    if (outBuf.length) {
      res.write(outBuf.join('\n') + '\n')
      outBuf = []
    }
  }

  for (const buf of logBuffers) {
    for (let i = 0; i < buf.length; i += CHUNK_SIZE) {
      const slice = buf.subarray(i, Math.min(i + CHUNK_SIZE, buf.length))
      const str = decoder.write(slice)
      const full = tail + str
      const lines = full.split('\n')
      tail = lines.pop() ?? ''

      for (const line of lines) {
        if (!lineMatchesTerms(line, validTerms)) continue
        if (collectParsed) {
          try {
            collectParsed.push(JSON.parse(line))
          } catch (_) {}
        }
        outBuf.push(line)
        if (outBuf.join('\n').length >= OUT_FLUSH_SIZE) flushOut()
      }
    }
  }

  if (tail && lineMatchesTerms(tail, validTerms)) {
    if (collectParsed) {
      try {
        collectParsed.push(JSON.parse(tail))
      } catch (_) {}
    }
    outBuf.push(tail)
  }
  flushOut()
  return { logData: collectParsed }
}

/**
 * Sadece parse edilmiş objeleri toplar; text oluşturmaz (0x1fffffe8 limitine takılmaz).
 * logToConsole modunda büyük dosyalar için kullanılır.
 */
function filterLogFilesLogOnly(logBuffers, terms, options = {}) {
  const validTerms = terms.map((t) => t.trim()).filter(Boolean)
  const collectParsed = []
  const decoder = new StringDecoder('utf8')
  let tail = ''

  for (const buf of logBuffers) {
    for (let i = 0; i < buf.length; i += CHUNK_SIZE) {
      const slice = buf.subarray(i, Math.min(i + CHUNK_SIZE, buf.length))
      const str = decoder.write(slice)
      const full = tail + str
      const lines = full.split('\n')
      tail = lines.pop() ?? ''

      for (const line of lines) {
        if (!lineMatchesTerms(line, validTerms)) continue
        try {
          collectParsed.push(JSON.parse(line))
        } catch (_) {}
      }
    }
  }
  if (tail && lineMatchesTerms(tail, validTerms)) {
    try {
      collectParsed.push(JSON.parse(tail))
    } catch (_) {}
  }
  return { logData: collectParsed }
}

/**
 * Filter plain log file buffers by terms (tüm sonucu bellekte birleştirir; küçük dosyalar için).
 * Çok büyük dosyalarda "Cannot create a string longer than 0x1fffffe8" alırsanız
 * route tarafında filterLogFilesStreaming kullanılmalı.
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

export { filterLogFiles, filterLogFilesStreaming, filterLogFilesLogOnly }
