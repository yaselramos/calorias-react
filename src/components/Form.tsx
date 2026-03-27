import { categories } from "../data/categorys"
import { useEffect, useState, type Dispatch, type FormEvent } from "react"
import { type ChangeEvent } from "react"
import type { Activity } from "../types"
import { type ActivityAction } from "../reducers/activity-reducer"
import { v4 as uuidv4 } from 'uuid'

type FormProps = {
    dispatch: Dispatch<ActivityAction>
    selectedDate: string
    editingActivity?: Activity | null
    onCancelEdit?: () => void
}

const estadoIniciar: Activity = {
    id: uuidv4(),
    category: categories[0]?.id ?? 1,
    name: "",
    calories: 0,
    date: new Date().toISOString().split("T")[0],
}

export default function Form({ dispatch, selectedDate, editingActivity, onCancelEdit }: FormProps) {
    const [activityType, setActivityType] = useState<Activity>(
        editingActivity || { ...estadoIniciar, id: uuidv4(), date: selectedDate }
    )

    useEffect(() => {
        if (editingActivity) {
            setActivityType(editingActivity)
            return
        }

        setActivityType((prev) => ({ ...prev, date: selectedDate }))
    }, [editingActivity, selectedDate])


    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        setActivityType((prev) => {
            if (name === "category") {
                return { ...prev, category: Number(value) }
            }

            if (name === "calories") {
                return { ...prev, calories: Number(value) }
            }

            if (name === "date") {
                return { ...prev, date: value }
            }

            return { ...prev, name: value }
        })
    }

    const isValidActivity = () => {
        const { name, calories, date } = activityType
        return name.trim() !== '' && calories > 0 && date.trim() !== ""
    }
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const normalizedActivity = { ...activityType, date: selectedDate }

        if (editingActivity) {
            dispatch({ type: "update-activity", payload: { activity: normalizedActivity } })
            if (onCancelEdit) onCancelEdit()
        } else {
            dispatch({ type: "save-activity", payload: { newActivity: normalizedActivity } })
        }
        setActivityType({ ...estadoIniciar, id: uuidv4(), date: selectedDate })
    }
    return (
        <form className="activity-form" onSubmit={handleSubmit}>
            <div className="field">
                <label htmlFor="category">Categoria</label>
                <select id="category" name="category" value={activityType.category} onChange={handleChange}>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="field">
                <label htmlFor="activity">Actividad</label>
                <input
                    id="activity"
                    name="name"
                    type="text"
                    placeholder="Ej. Ensalada / Caminata 30 min"
                    value={activityType.name}
                    onChange={handleChange}
                />
            </div>

            <div className="field">
                <label htmlFor="calories">Calorias</label>
                <input
                    id="calories"
                    name="calories"
                    type="number"
                    min={0}
                    placeholder="Ej. 320"
                    value={activityType.calories}
                    onChange={handleChange}
                />
            </div>

            <div className="field">
                <label htmlFor="date">Fecha</label>
                <input
                    id="date"
                    name="date"
                    type="date"
                    value={selectedDate}
                    disabled
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="button-primary" disabled={!isValidActivity()}>
                    {editingActivity ? "Actualizar actividad" : `Guardar ${activityType.category === 1 ? 'Comida' : 'Ejercicio'}`}
                </button>
                {editingActivity && (
                    <button
                        type="button"
                        className="button-secondary"
                        onClick={onCancelEdit}
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    )
}