export function FilterTermItem({ value, onChange, onAdd, onRemove, isFirst }) {
    return (
      <div className="filter-item">
        <input
          type="text"
          className="searchTerm"
          placeholder="Aranacak kelime..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {isFirst ? (
          <button
            type="button"
            className="addFilter"
            onClick={onAdd}
            aria-label="Filtre ekle"
          >
            +
          </button>
        ) : (
          <button
            type="button"
            className="removeFilter"
            onClick={onRemove}
            aria-label="Filtreyi kaldır"
          >
            -
          </button>
        )}
      </div>
    )
  }
  