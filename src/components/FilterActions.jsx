export function FilterActions({
  onFilter,
  disabled,
  isFiltering,
  logToConsole,
  onLogToConsoleChange,
}) {
  return (
    <div className="filter-actions">
      <button
        type="button"
        className="filter-button"
        onClick={onFilter}
        disabled={disabled}
      >
        {isFiltering ? '...' : 'Filtrele'}
      </button>
      <label className="log-to-console-option">
        <input
          type="checkbox"
          checked={logToConsole}
          onChange={(e) => onLogToConsoleChange(e.target.checked)}
          disabled={disabled}
        />
        <span>console log ?</span>
      </label>
    </div>
  )
}
