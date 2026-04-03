import { useMemo } from "react"
import CalorieDisplay from "./CalorieDisplay"
import CaloriesBarChart from "./CaloriesBarChart"
import { useCalorias } from "../hooks/useCalorias"


export default function CalorieTracker() {
    const { state } = useCalorias()
    // Contadores
    const caloriesConsumed = useMemo(() => state.activities.reduce((total, activity) => activity.category === 1 ? total + activity.calories : total, 0), [state])
    const caloriesBurned = useMemo(() => state.activities.reduce((total, activity) => activity.category === 2 ? total + activity.calories : total, 0), [state])
    const netCalories = useMemo(() => caloriesConsumed - caloriesBurned, [caloriesConsumed, caloriesBurned])

    return (
        <div className="rounded-2xl bg-slate-900 p-6 shadow-lg md:p-8">
            <h2 className="text-center text-2xl font-black text-white md:text-3xl">Resumen de Calorias</h2>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
                <CalorieDisplay
                    calories={caloriesConsumed}
                    text="Consumidas"
                />
                <CalorieDisplay
                    calories={caloriesBurned}
                    text="Ejercicio"
                />
                <CalorieDisplay
                    calories={netCalories}
                    text="Diferencia"
                />
            </div>

            <div className="mt-8">
                <CaloriesBarChart
                    consumed={caloriesConsumed}
                    burned={caloriesBurned}
                    balance={netCalories}
                />
            </div>

        </div>
    )
}
