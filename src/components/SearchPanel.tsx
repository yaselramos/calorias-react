import DateFilter from "./DateFilter"

type SearchPanelProps = {
  selectedDate: string
  onSearchDate: (date: string) => void
  isLoading: boolean
  message?: string | null
}

export default function SearchPanel({
  selectedDate,
  onSearchDate,
  isLoading,
  message,
}: SearchPanelProps) {
  return (
    <section className="panel panel--soft search-panel">
      <DateFilter initialDate={selectedDate} onSearchDate={onSearchDate} isLoading={isLoading} />
      {message && <p className="date-filter__status">{message}</p>}
    </section>
  )
}

