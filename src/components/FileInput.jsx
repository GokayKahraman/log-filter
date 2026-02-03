export function FileInput({ fileType, onFileChange }) {
  const isTarGz = fileType === 'targz'
  return (
    <div>
      <label htmlFor="logFile">
        {isTarGz ? 'tar.gz Dosyası:' : 'Log Dosyası:'}
      </label>
      <input
        type="file"
        id="logFile"
        multiple
        accept={isTarGz ? '.tar.gz,.tgz,application/gzip,application/x-gzip' : '.log,.txt,text/*'}
        onChange={onFileChange}
      />
    </div>
  )
}
