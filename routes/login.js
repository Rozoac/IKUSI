var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var app = express();
var Usuario = require("../models/usuario");

var SEED = require("../config/config").SEED;

app.post("/login", (req, res) => {
  var body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        error: err
      });
    }

    //EMAIL
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        mensaje: "Datos incorrectos - email",
        error: err
      });
    }
    //PASSWORD
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: "Datos incorrectos - password",
        error: err
      });
    }

    // usuarioDB.password = ":)";
    //TOKEN
    var token = jwt.sign({ usuario: usuarioDB }, SEED, {
      expiresIn: 28800
    });

    res.status(200).json({
      ok: true,
      usuario: usuarioDB,
      token: token,
      id: usuarioDB._id
    });
  });
});

module.exports = app;
