import { FilterTermItem } from './FilterTermItem'

export function FilterTerms({ terms, onAdd, onRemove, onTermChange }) {
  return (
    <div className="filters">
      {terms.map((term, index) => (
        <FilterTermItem
          key={index}
          value={term}
          onChange={(value) => onTermChange(index, value)}
          onAdd={onAdd}
          onRemove={() => onRemove(index)}
          isFirst={index === 0}
        />
      ))}
    </div>
  )
}
