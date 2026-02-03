export function FileTypeChoice({ fileType, onFileTypeChange, disabled }) {
  return (
    <div className="file-type-choice">
      <span>Dosya tipi:</span>
      <label>
        <input
          type="radio"
          name="fileType"
          value="log"
          checked={fileType === 'log'}
          onChange={() => onFileTypeChange('log')}
          disabled={disabled}
        />
        Log
      </label>
      <label>
        <input
          type="radio"
          name="fileType"
          value="targz"
          checked={fileType === 'targz'}
          onChange={() => onFileTypeChange('targz')}
          disabled={disabled}
        />
        tar.gz
      </label>
    </div>
  )
}
