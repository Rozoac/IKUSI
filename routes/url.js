var express = require("express");
var Url = require("../models/url");
var Button = require("../models/button");
var mdMenu = require("../middlewares/menu");
var moment = require("moment");
var app = express();





// =============================
// BORRAR UNA URL
// =============================

app.delete("/url/:id", (req, res) => {
  var id = req.params.id;

  Url.findByIdAndRemove(id, (err, urlBorrado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al eliminar una url",
        error: err
      });
    }

    if (!urlBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "La url con el id " + id + " no existe",
        error: "No existe una url con ese ID"
      });
    }

    res.status(200).json({
      ok: true,
      url: urlBorrado
    });
  });
});


// =============================
// OBTENER TODOS LAS URLS
// =============================

app.get("/url", (req, res) => {
  Url.find({})
    //   .populate("button", 'text fecha route_image url')
    .exec((err, urls) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando Urls",
          error: err
        });
      }

      res.status(200).json({
        urls
      });
    });
});

// =============================
// Crear una url nueva
// =============================

app.put("/url/:id", (req, res) => {
  var id = req.params.id;
  var body = req.body;

  //Crear una url
  var url = new Url(req.body);

  url.save();

  Button.findById(id, (err, button) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar el button",
        error: err
      });
    }

    if (!button) {
      return res.status(400).json({
        ok: false,
        mensaje: "El button con el id" + id + "no existe",
        error: "No existe un button con ese ID"
      });
    }

    button.url = url;

    button.save((err, urlGuardado) => {
        if (err) {
          return res
            .status(500)
            .json({
              ok: false,
              mensaje: "Error al guardar url",
              error: err
            });
        }

         res.status(200).json({ ok: true, url: urlGuardado.url });
    });


  });
});

// =============================
// ACTUALIZAR URL
// =============================

app.put("/:id/url", (req, res) => {
  var id = req.params.id;
  var body = req.body;
  console.log(body);

  Url.findById(id, (err, url) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar url",
        error: err
      });
    }

    if (!url) {
      return res.status(400).json({
        ok: false,
        mensaje: "La url con el id" + id + "no existe",
        error: "No existe una url con ese ID"
      });
    }
    if (body.autenticacion.password){
      url.autenticacion.password = body.autenticacion.password;
    }
    if (body.autenticacion.username){
      url.autenticacion.username = body.autenticacion.username;
    }
    if (body.direccion){
      url.direccion = body.direccion;
    } 

    url.save((err, urlGuardada) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al actualizar url",
          error: err
        });
      }

      res.status(200).json({
        ok: true,
        url: urlGuardada
      });
    });
  });
});

module.exports = app;
