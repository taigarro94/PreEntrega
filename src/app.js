import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import viewRouter from "./routes/views.routes.js";

const app = express();
const PORT = 8080;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(express.static("public"));

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
  console.log("Iniciado con socket.io");
});

const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", viewRouter);

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");
  socket.on("newProduct", (data) => {
    console.log(data);

    socketServer.emit("producto-nuevo", data);
  });

  socket.on("deleteProduct", (data) => {
    console.log(data);
    socketServer.emit("productoABorrar", data);
  });
});