import { Router } from "express";
import { AddAvailability, BookAppointment, CancelAppointment, GetAppointmentsDetails } from "../controllers/Appointment.contrller.js";
import { authMiddleware } from "../middleware/Auth.middlewere.js";

const AppointmentRoute = Router();
AppointmentRoute.post("/getappointmentsdetails",authMiddleware(),GetAppointmentsDetails);
AppointmentRoute.post("/availability",authMiddleware(),AddAvailability);
AppointmentRoute.post("/bookappointment",authMiddleware(),BookAppointment);
AppointmentRoute.post("/cancelappointment",authMiddleware(),CancelAppointment);

export {AppointmentRoute}