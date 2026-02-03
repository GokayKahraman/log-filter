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
    data.length && console.log(data)
    return data
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
  const [downloadFilename, setDownloadFilename] = useState('filtered_all_logs.log')
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
    setDownloadFilename('filtered_all_logs.log')
    setIsFiltering(true)
    setShowProgress(true)
    setTotalFileCount(files.length)

    const apiPath = API_BY_TYPE[fileType]
    const textParts = []
    const logParts = []

    try {
      for (let i = 0; i < files.length; i++) {
        setCurrentFileIndex(i + 1)
        setProgress(Math.round(((i + 1) / files.length) * 100))

        const result = await postFilter(apiPath, [files[i]], terms, logToConsole)

        if (logToConsole) {
          const data = result
          if (data?.length) logParts.push(...data)
        } else {
          if (result?.trim()) textParts.push(result)
        }
      }

      if (logToConsole) {
        if (!logParts.length) {
          setError('Eşleşen sonuç bulunamadı.')
          return
        }
        const text = logParts.map((item) => JSON.stringify(item)).join('\n')
        const blob = new Blob([text], { type: 'text/plain' })
        setDownloadUrl(URL.createObjectURL(blob))
        setDownloadFilename('filtered_all_logs.log')
        return
      }
      const text = textParts.join('\n')
      if (!text?.trim()) {
        setError('Eşleşen sonuç bulunamadı.')
        return
      }
      const blob = new Blob([text], { type: 'text/plain' })
      setDownloadUrl(URL.createObjectURL(blob))
      setDownloadFilename('filtered_all_logs.log')
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
    downloadFilename,
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
