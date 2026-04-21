const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Log = require("../models/Log");
const bcrypt = require("bcrypt");

// REGISTRO
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashed,
      role
    });

    await user.save();

    res.send("Usuario registrado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en registro");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    // 👇 SI NO EXISTE
    if (!user) {
      await new Log({ username, type: "fail" }).save();
      return res.send("Usuario no encontrado");
    }

    // 👇 VALIDAR PASSWORD
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      await new Log({ username, type: "fail" }).save();
      return res.send("Contraseña incorrecta");
    }

    // 👇 GUARDAR SESIÓN
    req.session.user = user;

    await new Log({ username, type: "success" }).save();

    res.json({
  message: "Login correcto",
  role: user.role
});

  } catch (error) {
    console.error("ERROR LOGIN:", error); // 👈 AQUÍ VERÁS EL ERROR REAL
    res.status(500).send("Error en el servidor");
  }
});

// LOGOUT
router.get("/logout", async (req, res) => {
  try {
    await new Log({
      username: req.session.user?.username,
      type: "logout"
    }).save();

    req.session.destroy();

    res.send("Sesión cerrada");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cerrar sesión");
  }
});

module.exports = router;