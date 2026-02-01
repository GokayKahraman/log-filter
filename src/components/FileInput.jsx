export function FileInput({ onFileChange }) {
  return (
    <div>
      <label htmlFor="logFile">Log Dosyası:</label>
      <input
        type="file"
        id="logFile"
        multiple
        accept=".log,.txt,text/*"
        onChange={onFileChange}
      />
    </div>
  )
}
