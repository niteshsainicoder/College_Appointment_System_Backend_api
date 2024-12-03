import express from "express";
import { MainRoute } from "./src/app.js";
import {ConnectDB} from "./src/utils/Connect.db.js";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
configDotenv();
 export const app = express();

 // Middleware that allows us to use cookies
app.use(cookieParser());

 // Middleware that allows us to use json in requests
app.use(express.json());
// Middleware that allows us to use urlencoded in requests
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// Middleware for Our Routes
app.use(MainRoute);
app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
    ConnectDB()
})

