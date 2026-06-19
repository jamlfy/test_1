import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import requestsRoutes from "./modules/requests/requests.routes.js";
import offerActionsRouter from "./modules/offers/offers.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestsRoutes);
app.use("/api/offers", offerActionsRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${env.PORT}`);
});

export default app;
