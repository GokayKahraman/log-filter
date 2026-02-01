import { useState, useCallback } from 'react'
import { readFileContentInChunks } from '../utils/logFilterUtils'

export function useLogFilter() {
  const [files, setFiles] = useState([])
  const [filterTerms, setFilterTerms] = useState([''])
  const [isFiltering, setIsFiltering] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [totalFileCount, setTotalFileCount] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [error, setError] = useState(null)
  const [logToConsole, setLogToConsole] = useState(false)

  const addFilter = useCallback(() => {
    setFilterTerms((prev) => [...prev, ''])
  }, [])

  const removeFilter = useCallback((index) => {
    setFilterTerms((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const updateFilterTerm = useCallback((index, value) => {
    setFilterTerms((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }, [])

  const handleFileChange = useCallback((e) => {
    const selected = e.target.files
    if (selected?.length) {
      setFiles(Array.from(selected))
      setDownloadUrl(null)
    }
  }, [])

  const filterLogs = useCallback(async () => {
    const terms = filterTerms.map((t) => t.trim()).filter(Boolean)
    if (files.length === 0 || terms.length === 0) {
      setError('Lütfen en az bir log dosyası seçin ve en az bir arama terimi girin.')
      return
    }

    setError(null)
    setDownloadUrl(null)
    setIsFiltering(true)
    setShowProgress(true)
    setProgress(0)
    const totalCount = files.filter((f) => f.size > 0).length
    setTotalFileCount(totalCount)

    try {
      const parts = []
      let bytesProcessed = 0
      const totalSize = files.reduce((acc, f) => acc + f.size, 0)
      let fileIndex = 0

      for (const file of files) {
        if (file.size === 0) continue
        fileIndex += 1
        setCurrentFileIndex(fileIndex)
        const fileChunks = await readFileContentInChunks(
          file,
          terms,
          (offset) => {
            const totalLoaded = bytesProcessed + offset
            setProgress(Math.min(100, Math.round((totalLoaded / totalSize) * 100)))
          },
          { logToConsole }
        )
        bytesProcessed += file.size
        fileChunks.forEach((chunk) => {
          if (chunk) parts.push(chunk)
        })
        if (fileChunks.some(Boolean) && fileIndex < totalCount) parts.push('\n')
      }

      if (parts.length === 0) {
        setError('Eşleşen sonuç bulunamadı.')
        return
      }

      const blob = new Blob(parts, { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
    } catch (err) {
      setError(err.message || 'Dosya işlenirken bir hata oluştu.')
    } finally {
      setIsFiltering(false)
      setShowProgress(false)
      setProgress(0)
      setCurrentFileIndex(0)
      setTotalFileCount(0)
    }
  }, [files, filterTerms, logToConsole])

  const hasTerms = filterTerms.some((t) => t.trim())

  return {
    files,
    filterTerms,
    isFiltering,
    showProgress,
    progress,
    currentFileIndex,
    totalFileCount,
    downloadUrl,
    error,
    hasTerms,
    logToConsole,
    setLogToConsole,
    addFilter,
    removeFilter,
    updateFilterTerm,
    handleFileChange,
    filterLogs,
  }
}
