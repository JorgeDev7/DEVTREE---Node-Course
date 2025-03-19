import e from "express";
import { router } from "./router";

const app = e();

// Leer datos de formularios (JSON)
app.use(e.json());

app.use("/", router);

export default app;
