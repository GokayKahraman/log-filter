export function Results({ error, downloadUrl, downloadFilename = 'filtered_all_logs.log' }) {
  return (
    <>
      {error && <p className="error">{error}</p>}
      <div id="results">
        {downloadUrl && (
          <a href={downloadUrl} download={downloadFilename}>
            Filtrelenmiş Logları İndir
          </a>
        )}
      </div>
    </>
  )
}
