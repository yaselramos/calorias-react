
import { useContext } from "react"
import { CaloriasContext } from "../context/CaloriasContext"


export const useCalorias = () => {
 const context = useContext(CaloriasContext)

 if(!context){
    throw new Error('useCalorias debe ser utilizado dentro de un CaloriasProvider')
 }

 return context
}