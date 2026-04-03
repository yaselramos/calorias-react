import { useMemo } from "react"
import { Activity } from "../types"
import { categories } from "../data/categories"
import { PencilSquareIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useCalorias } from "../hooks/useCalorias"


export default function ActivityList() {
    const { state ,dispatch} = useCalorias()

    const categoryName = useMemo(() =>
        (category: Activity['category']) => categories.find(cat => cat.id === category)?.name ?? ''
    , [])

    const isEmptyActivities = useMemo(() => state.activities.length === 0, [state.activities])

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-center text-2xl font-extrabold text-slate-800 md:text-3xl">
                Comida y Actividades
            </h2>
        
            {isEmptyActivities ? 
                <p className="my-8 rounded-xl bg-slate-50 px-4 py-6 text-center text-slate-500">No hay actividades aun...</p> :
                state.activities.map( activity => (
                    <article key={activity.id} className="mt-5 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                            <p className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white
                            ${activity.category === 1 ? 'bg-lime-600' : 'bg-orange-500'}`}>
                                {categoryName(+activity.category)}
                            </p>
                            <p className="text-xl font-bold text-slate-800 md:text-2xl">{activity.name}</p>
                            <p className="text-3xl font-black text-lime-600 md:text-4xl">
                                {activity.calories}{' '}
                                <span className="text-base font-semibold text-slate-600">Calorias</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3 md:gap-4">
                            <button
                                className="rounded-lg bg-white p-2 text-slate-700 shadow-sm transition hover:bg-lime-50 hover:text-lime-700"
                                onClick={() => dispatch({type: "set-activeId", payload: {id: activity.id}})}
                            >
                                <PencilSquareIcon
                                    className="h-7 w-7"
                                />
                            </button>

                            <button
                                className="rounded-lg bg-white p-2 text-red-500 shadow-sm transition hover:bg-red-50 hover:text-red-600"
                                onClick={() => dispatch({type: "delete-activity", payload: {id: activity.id}})}
                            >
                                <XCircleIcon
                                    className="h-7 w-7"
                                />
                            </button>
                        </div>
                    </article>
                ))}
        </div>
    )
}
