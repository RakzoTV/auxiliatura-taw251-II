import { Habitacion } from "./habitacion.entity.js";

export const Habitaciones: Habitacion[] = [
    {
        idHabitacion: 1,
        nombre: "Habitación Individual",
        tipo: "individual",
        precioPorNoche: 50,
        capacidad: 1,
        descripcion: "Una habitación acogedora para una persona."
    },
    {
        idHabitacion: 2,
        nombre: "Habitación Doble",
        tipo: "doble",
        precioPorNoche: 80,
        capacidad: 2,
        descripcion: "Una habitación cómoda para dos personas."
    },
    {
        idHabitacion: 3,
        nombre: "Suite de Lujo",
        tipo: "suite",
        precioPorNoche: 150,
        capacidad: 2,
        descripcion: "Una suite de lujo para dos personas."
    }
]