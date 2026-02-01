import { useState, useCallback, useEffect } from 'react'

const API_BY_TYPE = {
  log: '/api/filter-logs',
  targz: '/api/filter-targz',
}

async function postFilter(apiPath, files, terms, logToConsole) {
  const formData = new FormData()
  files.forEach((f) => formData.append('files', f))
  formData.append('terms', JSON.stringify(terms))
  formData.append('logToConsole', String(logToConsole))
  const res = await fetch(apiPath, { method: 'POST', body: formData })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Sunucu hatası: ${res.status}`)
  }
  if (logToConsole) {
    const data = await res.json()
    if (data.log?.length) console.log(data.log)
    return data.text ?? ''
  }
  return await res.text()
}

export function useLogFilter() {
  const [fileType, setFileType] = useState('log')
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

  useEffect(() => {
    setFiles([])
    setDownloadUrl(null)
  }, [fileType])

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
      setError('Lütfen en az bir dosya seçin ve en az bir arama terimi girin.')
      return
    }

    setError(null)
    setDownloadUrl(null)
    setIsFiltering(true)
    setShowProgress(true)
    setTotalFileCount(files.length)
    setCurrentFileIndex(1)
    setProgress(0)

    try {
      const apiPath = API_BY_TYPE[fileType]
      const text = await postFilter(apiPath, files, terms, logToConsole)
      if (!text?.trim()) {
        setError('Eşleşen sonuç bulunamadı.')
        return
      }
      const blob = new Blob([text], { type: 'text/plain' })
      setDownloadUrl(URL.createObjectURL(blob))
    } catch (err) {
      setError(err.message || 'Dosya işlenirken bir hata oluştu.')
    } finally {
      setIsFiltering(false)
      setShowProgress(false)
      setProgress(0)
      setCurrentFileIndex(0)
      setTotalFileCount(0)
    }
  }, [fileType, files, filterTerms, logToConsole])

  const hasTerms = filterTerms.some((t) => t.trim())

  return {
    fileType,
    setFileType,
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
