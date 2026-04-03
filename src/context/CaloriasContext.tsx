import { useEffect, useReducer, createContext } from "react"
import { ActivityActions,ActivityState,activityReducer,initialState} from "../reducers/activity-reducer"

const STORAGE_KEY = 'calorias-state'

type PersistedCaloriasState = Pick<ActivityState , 'activities' | 'activeId'>

const loadCaloriasState = (): ActivityState => {
  if (typeof window === 'undefined') return initialState

  try {
    const rawState = localStorage.getItem(STORAGE_KEY)
    if (!rawState) return initialState

    const parsed = JSON.parse(rawState) as Partial<PersistedCaloriasState>
    if (typeof parsed.activeId !== 'number' || !Array.isArray(parsed.activities)) {
      return initialState
    }

    return {
      ...initialState,
      activities: parsed.activities,
      activeId: parsed.activeId,
    }
  } catch {
    return initialState
  }
}

type CaloriasContextType = {
    state: ActivityState,
    dispatch: React.Dispatch<ActivityActions>
}


export const CaloriasContext = createContext<CaloriasContextType>(null!)



export const CaloriasProvider = ({children}: {children: React.ReactNode}) => {
  const [state, dispatch] = useReducer(activityReducer, initialState, loadCaloriasState)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stateToPersist: PersistedCaloriasState = {
      activities: state.activities,
      activeId: state.activeId,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist))
  }, [state.activeId, state.activities])

  return (
    <div>
      <CaloriasContext.Provider value={{state, dispatch}}>
        {children}
      </CaloriasContext.Provider>
    </div>
  )
}