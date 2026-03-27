import { useEffect, useState, type FormEvent } from "react"

type DateFilterProps = {
  initialDate: string
  onSearchDate: (date: string) => void
  isLoading?: boolean
}

export default function DateFilter({ initialDate, onSearchDate, isLoading = false }: DateFilterProps) {
  const [draftDate, setDraftDate] = useState(initialDate)

  useEffect(() => {
    setDraftDate(initialDate)
  }, [initialDate])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draftDate) {
      return
    }
    onSearchDate(draftDate)
  }

  const handleUseToday = () => {
    const today = new Date().toISOString().split("T")[0]
    setDraftDate(today)
    onSearchDate(today)
  }

  return (
    <div className="date-filter">
      <div className="panel__header">
        <h2>Buscar por fecha</h2>
        <p>Consulta actividades guardadas sin mezclar esta accion con el guardado.</p>
      </div>

      <form className="date-filter__controls" onSubmit={handleSubmit}>
        <label className="field" htmlFor="selectedDate">
          <span>Fecha</span>
          <input
            id="selectedDate"
            name="selectedDate"
            type="date"
            value={draftDate}
            onChange={(event) => setDraftDate(event.target.value)}
          />
        </label>

        <div className="date-filter__actions">
          <button type="submit" className="button-primary" disabled={isLoading || !draftDate}>
            Buscar
          </button>
          <button type="button" className="button-secondary" onClick={handleUseToday} disabled={isLoading}>
            Ir a hoy
          </button>
        </div>
      </form>

      {isLoading && <p className="date-filter__loading">Cargando actividades del backend...</p>}
    </div>
  )
}

