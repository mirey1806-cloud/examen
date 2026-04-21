require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const app = express();

// 🔹 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", 1);

app.use(session({
  secret: "secreto123",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
     httpOnly: false 
  }
}));

// 🔹 Sesiones (ANTES de rutas)
app.use(session({
  secret: "secreto123",
  resave: false,
  saveUninitialized: true
}));

// 🔹 Archivos estáticos
app.use(express.static("public"));

// 🔹 Rutas
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

// 🔹 Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// 🔹 Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.log(err));

// 🔹 Puerto (IMPORTANTE para Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});