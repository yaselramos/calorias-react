import { useEffect, useState } from "react"
import type { Activity } from "../types"
import { fetchActivitiesByDate } from "../services/activity-api"
import {
  getCachedActivitiesForDate,
  getTodayISO,
  writeActivitiesForDateInCache,
} from "../services/activity-cache"

export const useDateActivitySearch = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayISO())
  const [activities, setActivities] = useState<Activity[]>(() => getCachedActivitiesForDate(getTodayISO()))
  const [isLoadingDate, setIsLoadingDate] = useState(false)
  const [searchMessage, setSearchMessage] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    const loadByDate = async () => {
      setIsLoadingDate(true)
      setSearchMessage(null)

      const cachedActivities = getCachedActivitiesForDate(selectedDate)
      setActivities(cachedActivities)

      try {
        const backendActivities = await fetchActivitiesByDate(selectedDate)
        if (isCancelled) {
          return
        }
        setActivities(backendActivities)
        writeActivitiesForDateInCache(selectedDate, backendActivities)
      } catch {
        if (!isCancelled) {
          setSearchMessage("No se pudo cargar desde backend. Mostrando cache local.")
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingDate(false)
        }
      }
    }

    loadByDate()

    return () => {
      isCancelled = true
    }
  }, [selectedDate])

  return {
    selectedDate,
    activities,
    isLoadingDate,
    searchMessage,
    onSearchDate: setSelectedDate,
  }
}

