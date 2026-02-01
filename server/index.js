import express from 'express'
import multer from 'multer'
import { filterLogFiles } from './logFilterService.js'
import { filterTarGzFiles } from './tarGzFilterService.js'

const app = express()
const PORT = process.env.PORT || 3001

const memoryStorage = multer.memoryStorage()
const sizeLimit = { limits: { fileSize: 200 * 1024 * 1024 } }

const uploadLogs = multer({
  storage: memoryStorage,
  ...sizeLimit,
  fileFilter: (_req, file, cb) => {
    const name = (file.originalname || '').toLowerCase()
    const ok =
      /^text\//.test(file.mimetype) ||
      name.endsWith('.log') ||
      name.endsWith('.txt')
    cb(null, !!ok)
  },
})

const uploadTarGz = multer({
  storage: memoryStorage,
  ...sizeLimit,
  fileFilter: (_req, file, cb) => {
    const name = (file.originalname || '').toLowerCase()
    const ok =
      file.mimetype === 'application/gzip' ||
      file.mimetype === 'application/x-gzip' ||
      name.endsWith('.tar.gz') ||
      name.endsWith('.tgz')
    cb(null, !!ok)
  },
})

app.use(express.json({ limit: '1mb' }))

function parseTerms(body) {
  if (typeof body.terms === 'string') return JSON.parse(body.terms)
  if (Array.isArray(body.terms)) return body.terms
  return []
}

function getLogToConsole(body) {
  return body.logToConsole === true || body.logToConsole === 'true'
}

app.post('/api/filter-logs', uploadLogs.array('files', 20), async (req, res) => {
  try {
    const files = req.files || []
    const terms = parseTerms(req.body)
    const logToConsole = getLogToConsole(req.body)

    if (files.length === 0) {
      return res.status(400).json({ error: 'En az bir log dosyası gerekli.' })
    }
    if (!terms.length || !terms.some((t) => String(t).trim())) {
      return res.status(400).json({ error: 'En az bir filtre terimi girin.' })
    }

    const buffers = files.map((f) => f.buffer)
    const { text, logData } = filterLogFiles(buffers, terms, { logToConsole })

    if (logToConsole) {
      return res.status(200).json({ text: text || '', log: logData || [] })
    }
    if (!text.trim()) {
      return res.status(200).set('Content-Type', 'text/plain; charset=utf-8').send('')
    }
    res.set('Content-Type', 'text/plain; charset=utf-8')
    res.send(text)
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ error: err.message || 'Log dosyaları işlenirken bir hata oluştu.' })
  }
})

app.post('/api/filter-targz', uploadTarGz.array('files', 20), async (req, res) => {
  try {
    const files = req.files || []
    const terms = parseTerms(req.body)
    const logToConsole = getLogToConsole(req.body)

    if (files.length === 0) {
      return res.status(400).json({ error: 'En az bir tar.gz dosyası gerekli.' })
    }
    if (!terms.length || !terms.some((t) => String(t).trim())) {
      return res.status(400).json({ error: 'En az bir filtre terimi girin.' })
    }
    const buffers = files.map((f) => f.buffer)
    const { text, totalLogFiles, logData } = await filterTarGzFiles(buffers, terms, { logToConsole })

    if (logToConsole) {
      return res.status(200).json({ text: text || '', log: logData || [] })
    }

    if (!text || totalLogFiles === 0) {
      return res.status(200).set('Content-Type', 'text/plain; charset=utf-8').send('')
    }

    res.set('Content-Type', 'text/plain; charset=utf-8')
    res.send(text)
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ error: err.message || 'tar.gz işlenirken bir hata oluştu.' })
  }
})

app.listen(PORT, () => {
  console.log(`Log filter API http://localhost:${PORT}`)
})
