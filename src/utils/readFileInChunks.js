import { filterLinesByTerms } from './lineFilter.js'

const CHUNK_SIZE = 1024 * 1024

export function readFileContentInChunks(file, searchTerms, onProgress, options = {}) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    let offset = 0
    const chunks = []
    let lineBuffer = ''

    fileReader.onload = (e) => {
      const content = lineBuffer + e.target.result
      const lastNewlineIndex = content.lastIndexOf('\n')

      const terms = searchTerms.filter(Boolean)

      if (lastNewlineIndex >= 0) {
        const completePart = content.slice(0, lastNewlineIndex + 1)
        const filtered = completePart ? filterLinesByTerms(completePart, terms, options) : ''
        if (filtered) chunks.push(filtered)
        lineBuffer = lastNewlineIndex < content.length - 1 ? content.slice(lastNewlineIndex + 1) : ''
      } else {
        lineBuffer = content
      }

      offset += CHUNK_SIZE
      onProgress(offset, file.size)

      if (offset < file.size) {
        const slice = file.slice(offset, offset + CHUNK_SIZE)
        fileReader.readAsText(slice)
      } else {
        if (lineBuffer) {
          const filtered = filterLinesByTerms(lineBuffer, terms, options)
          if (filtered) chunks.push(filtered)
        }
        resolve(chunks)
      }
    }

    fileReader.onerror = () => {
      reject(new Error('Dosya okunamadı!'))
    }

    const slice = file.slice(offset, offset + CHUNK_SIZE)
    fileReader.readAsText(slice)
  })
}
