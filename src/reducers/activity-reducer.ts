import type { Activity } from "../types"

export type ActivityAction =
  | { type: "save-activity"; payload: { newActivity: Activity } }
  | { type: "update-activity"; payload: { activity: Activity } }
  | { type: "delete-activity"; payload: { index: number } }
  | { type: "set-activities"; payload: { activities: Activity[] } }
  | { type: "reset-activities" }

type ActivityState = {
  activities: Activity[]
}

export const initialState: ActivityState = {
  activities: [],
}

export const activityReducer = (state: ActivityState = initialState, action: ActivityAction): ActivityState => {
  if (action.type === "save-activity") {
    return {
      ...state,
      activities: [...state.activities, action.payload.newActivity],
    }
  }

  if (action.type === "update-activity") {
    return {
      ...state,
      activities: state.activities.map((activity) =>
        activity.id === action.payload.activity.id ? action.payload.activity : activity
      ),
    }
  }

  if (action.type === "delete-activity") {
    return {
      ...state,
      activities: state.activities.filter((_, idx) => idx !== action.payload.index),
    }
  }

  if (action.type === "set-activities") {
    return {
      ...state,
      activities: action.payload.activities,
    }
  }

  if (action.type === "reset-activities") {
    return {
      ...state,
      activities: [],
    }
  }

  return state
}