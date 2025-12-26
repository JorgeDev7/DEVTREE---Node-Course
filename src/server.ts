import cors from "cors";
import "dotenv/config";
import e from "express";
import { corsConfig } from "./config/cors";
import { connectDB } from "./config/db";
import { router } from "./router";

connectDB();

const app = e();

//Cors
app.use(cors(corsConfig));
// Leer datos de formularios (JSON)
app.use(e.json());

app.use("/", router);

export default app;
