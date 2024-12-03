import  { Router } from "express";
import { AuthRoute } from "./routes/Auth.route.js";
import { AppointmentRoute } from "./routes/Appointment.route.js";

const MainRoute = Router();

MainRoute.use("/auth",AuthRoute);
MainRoute.use("/appointment",AppointmentRoute);

export {MainRoute}