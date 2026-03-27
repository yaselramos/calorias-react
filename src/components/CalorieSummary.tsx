import type { Activity } from "../types"

type CalorieSummaryProps = {
  activities: Activity[]
}

const formatCalories = (value: number) => {
  return new Intl.NumberFormat("es-ES").format(value)
}

export default function CalorieSummary({ activities }: CalorieSummaryProps) {
  const consumedCalories = activities
    .filter((activity) => activity.category === 1 && activity.calories > 0)
    .reduce((total, activity) => total + activity.calories, 0)

  const burnedCalories = activities
    .filter((activity) => activity.category === 2 && activity.calories > 0)
    .reduce((total, activity) => total + activity.calories, 0)

  const totalBalance = consumedCalories - burnedCalories

  return (
    <aside className="panel panel--soft">
      <div className="panel__header">
        <h2>Resumen rapido</h2>
        <p>Vista real de tu progreso diario.</p>
      </div>

      <div className="stats-grid">
        <article className="stat-card stat-card--positive">
          <p>Calorias consumidas</p>
          <strong>{formatCalories(consumedCalories)}</strong>
        </article>

        <article className="stat-card stat-card--negative">
          <p>Calorias quemadas</p>
          <strong>{formatCalories(burnedCalories)}</strong>
        </article>

        <article className="stat-card">
          <p>Balance total</p>
          <strong>{formatCalories(totalBalance)}</strong>
        </article>
      </div>

      {activities.length === 0 && (
        <div className="empty-state">
          <h3>Sin actividades guardadas aun</h3>
          <p>Agrega una comida o ejercicio para empezar a ver tu balance del dia.</p>
        </div>
      )}
    </aside>
  )
}

