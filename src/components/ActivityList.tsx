import { categories } from "../data/categorys"
import type { Activity } from "../types"

type ActivityListProps = {
  activities: Activity[]
  onEdit?: (activity: Activity) => void
  onDelete?: (idx: number) => void
  readOnly?: boolean
  onReset?: () => void
  onSaveToBackend?: () => void
  isSaving?: boolean
  saveMessage?: string | null
}

export default function ActivityList({
  activities,
  onEdit,
  onDelete,
  readOnly = false,
  onReset,
  onSaveToBackend,
  isSaving = false,
  saveMessage,
}: ActivityListProps) {
  const getCategoryName = (categoryId: number) => {
    return categories.find((cat) => cat.id === categoryId)?.name ?? "Desconocida"
  }

  const getActivityIcon = (categoryId: number) => {
    return categoryId === 1 ? "🍽️" : "💪"
  }

  return (
    <div className="activity-list">
      <h3 className="activity-list__title">
        {readOnly ? "Resultados de la busqueda" : "Historial de actividades"}
      </h3>

      {activities.length === 0 ? (
        <p className="activity-list__empty">No hay actividades aún. ¡Comienza a registrar!</p>
      ) : (
        <>
          <ul className="activity-list__items">
            {activities.map((activity, idx) => (
              <li key={idx} className={`activity-item ${readOnly ? "activity-item--readonly" : ""}`}>
                <span className="activity-item__icon">{getActivityIcon(activity.category)}</span>

                <div className="activity-item__content">
                  <p className="activity-item__name">{activity.name}</p>
                  <p className="activity-item__category">
                    {getCategoryName(activity.category)} • {activity.date}
                  </p>
                </div>

                <div className={`activity-item__calories ${activity.category === 1 ? "activity-item__calories--positive" : "activity-item__calories--negative"}`}>
                  {activity.category === 1 ? "+" : "-"}
                  {activity.calories}
                </div>

                {!readOnly && onEdit && onDelete && (
                  <div className="activity-item__actions">
                    <button
                      className="activity-item__edit"
                      onClick={() => onEdit(activity)}
                      aria-label="Editar actividad"
                      title="Editar"
                    >
                      ✎
                    </button>
                    <button
                      className="activity-item__delete"
                      onClick={() => onDelete(idx)}
                      aria-label="Eliminar actividad"
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {!readOnly && onReset && onSaveToBackend && (
            <>
              <div className="activity-list__footer-actions">
                <button
                  className="button-secondary activity-list__reset"
                  type="button"
                  onClick={onReset}
                  disabled={isSaving}
                >
                  Reiniciar lista
                </button>
                <button
                  className="button-primary activity-list__save"
                  type="button"
                  onClick={onSaveToBackend}
                  disabled={isSaving}
                >
                  {isSaving ? "Guardando..." : "Guardar en backend"}
                </button>
              </div>
              {saveMessage && <p className="activity-list__status">{saveMessage}</p>}
            </>
          )}
        </>
      )}
    </div>
  )
}