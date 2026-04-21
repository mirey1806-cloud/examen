require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const session = require("express-session");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "secreto123",
  resave: false,
  saveUninitialized: true
}));

app.use(express.static("public"));

const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

const path = require("path");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Conexión BD
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.log(err));

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});