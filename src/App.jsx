import { useLogFilter } from './hooks/useLogFilter'
import {
  FileInput,
  FileTypeChoice,
  FilterActions,
  FilterTerms,
  ProgressBar,
  Results,
} from './components'

export default function App() {
  const {
    fileType,
    setFileType,
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
      <FileTypeChoice
        fileType={fileType}
        onFileTypeChange={setFileType}
        disabled={isFiltering}
      />
      <FileInput fileType={fileType} onFileChange={handleFileChange} />

      <FilterTerms
        terms={filterTerms}
        onAdd={addFilter}
        onRemove={removeFilter}
        onTermChange={updateFilterTerm}
      />

      <FilterActions
        onFilter={filterLogs}
        disabled={isFiltering || !hasTerms || files.length === 0}
        isFiltering={isFiltering}
        logToConsole={logToConsole}
        onLogToConsoleChange={setLogToConsole}
      />

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
