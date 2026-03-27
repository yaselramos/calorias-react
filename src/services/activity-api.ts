import type { Activity } from "../types"

type BulkSaveRequest = {
  date: string
  activities: Activity[]
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api"

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || "No se pudo completar la solicitud al backend")
  }

  return (await response.json()) as T
}

export const fetchActivitiesByDate = async (date: string) => {
  return request<Activity[]>(`/activities?date=${encodeURIComponent(date)}`)
}

export const saveActivitiesByDate = async (payload: BulkSaveRequest) => {
  return request<Activity[]>("/activities/bulk", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

