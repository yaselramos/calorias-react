import { useEffect, useRef, useState } from "react"
import Form from "./components/Form"
import { initialState } from "./reducers/activity-reducer"
import ActivityList from "./components/ActivityList"
import CalorieSummary from "./components/CalorieSummary"
import CaloriesChart from "./components/CaloriesChart"
import type { Activity } from "./types"
import ViewMenu, { type ViewMode } from "./components/ViewMenu"
import { fetchActivitiesByDate, saveActivitiesByDate } from "./services/activity-api"

import {
  getCachedActivitiesForDate,
  getInitialActivitiesForToday,
  getTodayISO,
  writeActivitiesForDateInCache,
} from "./services/activity-cache"
import { useActivity } from "./hooks/useActivity"
const getInitialState = () => {
  const fallbackState = initialState

  return {
    ...fallbackState,
    activities: getInitialActivitiesForToday(),
  }
}

function App() {
  const { state, dispatch } = useActivity()
  const [activeView, setActiveView] = useState<ViewMode>("search")
  const [manageDate, setManageDate] = useState(getTodayISO())
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [isLoadingManageDate, setIsLoadingManageDate] = useState(false)
  const [manageMessage, setManageMessage] = useState<string | null>(null)
  const [isSavingBackend, setIsSavingBackend] = useState(false)
  const [backendMessage, setBackendMessage] = useState<string | null>(null)
  const manageDateRef = useRef(manageDate)



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

    </>
  )
}

export default App
