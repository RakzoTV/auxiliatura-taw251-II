import { Reserva } from "./reserva.entity.js";

export const reservaData: Reserva[] = [
    {
        idReserva: 1,
        habitacionId: 1,
        nombreHuesped: "Juan Pérez",
        fechaCheckIn: new Date("2026-01-01"),
        fechaCheckOut: new Date("2026-01-05"),
        cantidadHuespedes: 2,
        precioTotal: 500
    },
    {
        idReserva: 2,
        habitacionId: 2,
        nombreHuesped: "María López",
        fechaCheckIn: new Date("2026-01-02"),
        fechaCheckOut: new Date("2026-01-06"),
        cantidadHuespedes: 1,
        precioTotal: 300
    },
    {
        idReserva: 3,
        habitacionId: 3,
        nombreHuesped: "Carlos García",
        fechaCheckIn: new Date("2026-01-03"),
        fechaCheckOut: new Date("2026-01-07"),
        cantidadHuespedes: 3,
        precioTotal: 750
    }
]