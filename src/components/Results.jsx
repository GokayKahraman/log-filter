export function Results({ error, downloadUrl }) {
  return (
    <>
      {error && <p className="error">{error}</p>}
      <div id="results">
        {downloadUrl && (
          <a href={downloadUrl} download="filtered_all_logs.log">
            Filtrelenmiş Logları İndir
          </a>
        )}
      </div>
    </>
  )
}
