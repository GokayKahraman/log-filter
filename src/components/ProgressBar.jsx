export function ProgressBar({ show, progress, currentFileIndex = 0, totalFileCount = 0 }) {
  if (!show) return null

  return (
    <div className="progress-wrapper">
      {currentFileIndex > 0 && totalFileCount > 0 && (
        <div className="progress-file-label">
          Dosya {currentFileIndex} / {totalFileCount} — %{progress}
        </div>
      )}
      <div id="progress-container">
        <div id="progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
