import { useEffect, useReducer, useRef, useState } from "react"
import Form from "./components/Form"
import { activityReducer, initialState } from "./reducers/activity-reducer"
import ActivityList from "./components/ActivityList"
import CalorieSummary from "./components/CalorieSummary"
import CaloriesChart from "./components/CaloriesChart"
import type { Activity } from "./types"
import SearchPanel from "./components/SearchPanel"
import ViewMenu, { type ViewMode } from "./components/ViewMenu"
import { fetchActivitiesByDate, saveActivitiesByDate } from "./services/activity-api"
import { useDateActivitySearch } from "./hooks/useDateActivitySearch"
import {
  getCachedActivitiesForDate,
  getInitialActivitiesForToday,
  getTodayISO,
  writeActivitiesForDateInCache,
} from "./services/activity-cache"

const getInitialState = () => {
  const fallbackState = initialState

  return {
    ...fallbackState,
    activities: getInitialActivitiesForToday(),
  }
}

function App() {
  const [state, dispatch] = useReducer(activityReducer, initialState, getInitialState)
  const [activeView, setActiveView] = useState<ViewMode>("search")
  const [manageDate, setManageDate] = useState(getTodayISO())
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [isLoadingManageDate, setIsLoadingManageDate] = useState(false)
  const [manageMessage, setManageMessage] = useState<string | null>(null)
  const [isSavingBackend, setIsSavingBackend] = useState(false)
  const [backendMessage, setBackendMessage] = useState<string | null>(null)
  const manageDateRef = useRef(manageDate)

  const {
    selectedDate: searchDate,
    activities: searchActivities,
    isLoadingDate,
    searchMessage,
    onSearchDate,
  } = useDateActivitySearch()

  useEffect(() => {
    manageDateRef.current = manageDate
  }, [manageDate])

  useEffect(() => {
    let isCancelled = false

    const loadManageDateActivities = async () => {
      setIsLoadingManageDate(true)
      setManageMessage(null)
      setBackendMessage(null)
      setEditingActivity(null)

      const cachedActivities = getCachedActivitiesForDate(manageDate)
      dispatch({ type: "set-activities", payload: { activities: cachedActivities } })

      try {
        const backendActivities = await fetchActivitiesByDate(manageDate)
        if (isCancelled) {
          return
        }
        dispatch({ type: "set-activities", payload: { activities: backendActivities } })
        writeActivitiesForDateInCache(manageDate, backendActivities)
      } catch {
        if (!isCancelled) {
          setManageMessage("No se pudo cargar desde backend. Mostrando datos locales de Gestionar.")
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingManageDate(false)
        }
      }
    }

    loadManageDateActivities()

    return () => {
      isCancelled = true
    }
  }, [manageDate])

  useEffect(() => {
    writeActivitiesForDateInCache(manageDateRef.current, state.activities)
  }, [state.activities])

  useEffect(() => {
    setEditingActivity(null)
  }, [manageDate])

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity)
  }

  const handleDelete = (idx: number) => {
    dispatch({ type: "delete-activity", payload: { index: idx } })
  }

  const handleReset = () => {
    dispatch({ type: "reset-activities" })
    setEditingActivity(null)
    setBackendMessage("Lista reiniciada localmente para la fecha seleccionada.")
  }

  const handleSaveToBackend = async () => {
    setIsSavingBackend(true)
    setBackendMessage(null)

    try {
      const syncedActivities = await saveActivitiesByDate({
        date: manageDate,
        activities: state.activities,
      })
      dispatch({ type: "set-activities", payload: { activities: syncedActivities } })
      writeActivitiesForDateInCache(manageDate, syncedActivities)
      setBackendMessage("Actividades guardadas correctamente en el backend.")
    } catch {
      setBackendMessage("No se pudo guardar en backend. Revisa que Spring Boot este corriendo.")
    } finally {
      setIsSavingBackend(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingActivity(null)
  }

  const handleChangeView = (view: ViewMode) => {
    setActiveView(view)
    setEditingActivity(null)
  }

  const activitiesForManage = state.activities

  return (
    <>
      <header className="hero">
        <div className="hero__container">
          <p className="hero__eyebrow">Calorie Tracker</p>
          <h1>Contador de calorias</h1>
          <p className="hero__subtitle">
            Registra tus comidas y ejercicios para ver el balance de energia del dia.
          </p>
        </div>
      </header>

      <main className="layout">
        <section className="layout__menu">
          <ViewMenu activeView={activeView} onChangeView={handleChangeView} />
        </section>

        {activeView === "search" ? (
          <>
            <SearchPanel
              selectedDate={searchDate}
              onSearchDate={onSearchDate}
              isLoading={isLoadingDate}
              message={searchMessage}
            />

            <section className="panel panel--full">
              <ActivityList activities={searchActivities} readOnly />
            </section>
          </>
        ) : (
          <>
            <section className="panel panel--soft manage-date-panel">
              <div className="panel__header">
                <h2>Fecha de gestion</h2>
                <p>Esta fecha es independiente de la busqueda.</p>
              </div>

              <label className="field" htmlFor="manageDate">
                <span>Fecha</span>
                <input
                  id="manageDate"
                  name="manageDate"
                  type="date"
                  value={manageDate}
                  onChange={(event) => setManageDate(event.target.value)}
                  disabled={isSavingBackend}
                />
              </label>

              {isLoadingManageDate && (
                <p className="manage-date-panel__status">Cargando actividades para gestionar...</p>
              )}
              {manageMessage && <p className="manage-date-panel__status">{manageMessage}</p>}
            </section>

            <section className="panel">
              <div className="panel__header">
                <h2>{editingActivity ? "Editar actividad" : "Nueva actividad"}</h2>
                <p>{editingActivity ? "Actualiza los datos y guarda los cambios." : "Completa los campos para guardar un registro."}</p>
              </div>
              <Form
                key={editingActivity?.id || "new"}
                dispatch={dispatch}
                selectedDate={manageDate}
                editingActivity={editingActivity}
                onCancelEdit={handleCancelEdit}
              />
            </section>


            <CalorieSummary activities={activitiesForManage} />

            <section className="panel">
              <ActivityList
                activities={activitiesForManage}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReset={handleReset}
                onSaveToBackend={handleSaveToBackend}
                isSaving={isSavingBackend}
                saveMessage={backendMessage}
              />
            </section>

            <section className="panel">
              <div className="panel__header">
                <h2>Grafico de calorias</h2>
                <p>Compara rapidamente calorias consumidas, quemadas y el balance.</p>
              </div>
              <CaloriesChart activities={activitiesForManage} />
            </section>
          </>
        )}
      </main>
    </>
  )
}

export default App
