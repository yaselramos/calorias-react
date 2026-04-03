import { useEffect, useMemo } from 'react'
import Form from "./components/Form"
import ActivityList from './components/ActivityList'
import CalorieTracker from './components/CalorieTracker'
import { useCalorias } from './hooks/useCalorias'

function App() {

    const {state, dispatch} = useCalorias()

    useEffect(() => {
        localStorage.setItem('activities', JSON.stringify(state.activities))
    }, [state.activities])

    const canRestartApp = useMemo(() => state.activities.length > 0, [state.activities])

    return (
        <main className="min-h-screen bg-slate-100 text-slate-800">
            <header className="bg-gradient-to-r from-lime-600 to-emerald-600 shadow-md">
                <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 md:px-6">
                    <h1 className="text-base font-extrabold uppercase tracking-wide text-white md:text-xl">
                        Contador de Calorias
                    </h1>

                    <button
                        className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold uppercase text-white transition hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-40 md:text-sm"
                        disabled={!canRestartApp}
                        onClick={() => dispatch({type: 'restart-app'})}
                    >
                        Reiniciar App
                    </button>
                </div>
            </header>

            <section className="mx-auto w-full max-w-5xl px-4 pt-8 md:px-6 md:pt-10">
                <Form
                  
                />
            </section>

            <section className="mx-auto mt-8 w-full max-w-5xl px-4 md:px-6">
                <CalorieTracker />
            </section>

            <section className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 md:py-10">
                <ActivityList
                  
                />
            </section>
        </main>
    )
}

export default App
