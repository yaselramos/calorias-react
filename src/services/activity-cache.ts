import type { Activity } from "../types"

const STORAGE_KEY = "calorie-tracker-activities"

export type ActivitiesByDate = Record<string, Activity[]>

export const getTodayISO = () => new Date().toISOString().split("T")[0]

export const getStoredActivitiesByDate = (): ActivitiesByDate => {
  if (typeof window === "undefined") {
    return {}
  }

  try {
    const storedActivities = window.localStorage.getItem(STORAGE_KEY)
    if (!storedActivities) {
      return {}
    }

    const parsedActivities = JSON.parse(storedActivities)
    if (Array.isArray(parsedActivities)) {
      return { [getTodayISO()]: parsedActivities }
    }

    return typeof parsedActivities === "object" && parsedActivities !== null ? parsedActivities : {}
  } catch {
    return {}
  }
}

export const getCachedActivitiesForDate = (date: string): Activity[] => {
  const cache = getStoredActivitiesByDate()
  return Array.isArray(cache[date]) ? cache[date] : []
}

export const writeActivitiesForDateInCache = (date: string, activities: Activity[]) => {
  if (typeof window === "undefined") {
    return
  }

  const cache = getStoredActivitiesByDate()
  cache[date] = activities
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
}

export const getInitialActivitiesForToday = (): Activity[] => {
  if (typeof window === "undefined") {
    return []
  }

  return getCachedActivitiesForDate(getTodayISO())
}

