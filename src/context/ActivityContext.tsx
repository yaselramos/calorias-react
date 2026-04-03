import { createContext, useReducer, type ReactNode } from "react";
import{activityReducer,initialState, type ActivityState, type ActivityAction} from "../reducers/activity-reducer"

export const ActivityContext = createContext<ActivityContextType>(null!)

type ActivityProviderType = {
  
    children: ReactNode
}
type ActivityContextType = {
    state:  ActivityState,
    disparch: React.Dispatch<ActivityAction>
}
export const  ActivityProvider=({children}:ActivityProviderType)=> {
    const [state,disparch]=useReducer(activityReducer,initialState)
  return (
   <ActivityContext.Provider value={{
    state,disparch
   }}>
    {children}
   </ActivityContext.Provider>
  )
}
