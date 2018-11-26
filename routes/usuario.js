var express = require("express");
var bcrypt = require("bcryptjs");
var app = express();
var jwt = require("jsonwebtoken");
var Usuario = require("../models/usuario");
var mdAutenticacion = require("../middlewares/autenticacion");

// =============================
// OBTENER TODOS LOS USUARIOS
// =============================

app.get("/usuario", mdAutenticacion.verificaToken, (req, res, next) => {

  var desde = req.query.desde || 0;
  desde = Number(desde);

  Usuario.find({}, 'nombre email img role')
  .skip(desde)
  .limit(5)
  .exec((err, usuarios) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando usuarios",
        error: err
      });
    }

    Usuario.count({}, (err, conteo) => {
      res.status(200).json({
        ok: true,
        usuarios: usuarios,
        total: conteo
      });
    });
  });
});

// =============================
// ACTUALIZAR USUARIO
// =============================

app.put("/usuario/:id", mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        error: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: "El usuario con el id" + id + "no existe",
        error: "No existe un usuario con ese ID"
      });
    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;
    // usuario.password = bcrypt.hashSync(body.password, 10);
    console.log(body.password);

    usuario.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al actualizar usuario",
          error: err
        });
      }

      usuarioGuardado.password = ":)";

      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado
      });
    });
  });
});

// =============================
// Crear un usuario nuevo
// =============================
app.post("/usuario",  (req, res) => {
  // mdAutenticacion.verificaToken
  var body = req.body;

  var usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10)
    
  });

  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear un usuario",
        error: err
      });
    }

    res.status(201).json({ ok: true, usuario: usuarioGuardado, usuarioToken: req.usuario });
  });
});

// =============================
// borrar un usuario
// =============================

app.delete("/usuario/:id", mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al eliminar un usuario",
        error: err
      });
    }

    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "El usuario con el id " + id + " no existe",
        error: "No existe un usuario con ese ID"
      });
    }

    res.status(200).json({
      ok: true,
      usuario: usuarioBorrado
    });
  });
});

module.exports = app;
