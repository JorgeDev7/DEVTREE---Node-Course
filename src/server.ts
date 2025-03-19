import "dotenv/config";
import e from "express";
import { connectDB } from "./config/db";
import { router } from "./router";

const app = e();
connectDB();
// Leer datos de formularios (JSON)
app.use(e.json());

app.use("/", router);

export default app;
