const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Log = require("../models/Log");
const bcrypt = require("bcrypt");

// REGISTRO
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({ username, password: hashed, role });
  await user.save();

  res.send("Usuario registrado");
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    await new Log({ username, type: "fail" }).save();
    return res.send("Usuario no encontrado");
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    await new Log({ username, type: "fail" }).save();
    return res.send("Contraseña incorrecta");
  }

  req.session.user = user;

  await new Log({ username, type: "success" }).save();

  res.send("Login correcto");
});

// LOGOUT
router.get("/logout", async (req, res) => {
  await new Log({
    username: req.session.user?.username,
    type: "logout"
  }).save();

  req.session.destroy();
  res.send("Sesión cerrada");
});

module.exports = router;