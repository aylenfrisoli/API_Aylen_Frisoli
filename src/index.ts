import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import tareaRoutes from "./routes/tarea.routes";
import { errorHandler } from "./middlewares/errorHandler.middleware";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// todo lo de auth (register/login) queda bajo /users, como pide la consigna
app.use("/users", authRoutes);

// el crud de tareas queda bajo /items, protegido por verifyToken dentro de tarea.routes
app.use("/items", tareaRoutes);

// va al final, despues de todas las rutas, porque express solo lo detecta como error handler si es el ultimo middleware con 4 parametros
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
