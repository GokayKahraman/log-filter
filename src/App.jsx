import { useLogFilter } from './hooks/useLogFilter'
import { FileInput, FilterTerms, ProgressBar, Results } from './components'

export default function App() {
  const {
    filterTerms,
    isFiltering,
    showProgress,
    progress,
    currentFileIndex,
    totalFileCount,
    downloadUrl,
    error,
    hasTerms,
    files,
    logToConsole,
    setLogToConsole,
    addFilter,
    removeFilter,
    updateFilterTerm,
    handleFileChange,
    filterLogs,
  } = useLogFilter()

  return (
    <div className="container">
      <FileInput onFileChange={handleFileChange} />

      <FilterTerms
        terms={filterTerms}
        onAdd={addFilter}
        onRemove={removeFilter}
        onTermChange={updateFilterTerm}
      />

      <div className="filter-actions">
        <button
          type="button"
          className="filter-button"
          onClick={filterLogs}
          disabled={isFiltering || !hasTerms || files.length === 0}
        >
          {isFiltering ? '...' : 'Filtrele'}
        </button>
        <label className="log-to-console-option">
          <input
            type="checkbox"
            checked={logToConsole}
            onChange={(e) => setLogToConsole(e.target.checked)}
            disabled={isFiltering}
          />
          <span>console log ?</span>
        </label>
      </div>

      <Results error={error} downloadUrl={downloadUrl} />

      <ProgressBar
        show={showProgress}
        progress={progress}
        currentFileIndex={currentFileIndex}
        totalFileCount={totalFileCount}
      />
    </div>
  )
}
