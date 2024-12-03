import { Router } from "express";
import { Login, Register } from "../controllers/Auth.controller.js";

const AuthRoute = Router();

AuthRoute.post("/login", Login );
AuthRoute.post("/register", Register);

export {AuthRoute}