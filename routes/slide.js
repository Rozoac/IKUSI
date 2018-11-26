var express = require("express");
var Slide = require("../models/slide");
var Button = require("../models/button");
var moment = require("moment");
var app = express();

// =============================
// OBTENER TODOS LOS SLIDES
// =============================

app.get("/slide", (req, res) => {
  Slide.find({})
    //   .populate("button", 'text fecha route_image url')
    .exec((err, slides) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando slides",
          error: err
        });
      }

      res.status(200).json({ slides });
    });
});

// =============================
// BORRAR UN SLIDE
// =============================

app.delete("/slide/:id", (req, res) => {
  var id = req.params.id;

  Slide.findByIdAndRemove(id, (err, slideBorrado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al eliminar un slide",
        error: err
      });
    }

    if (!slideBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "El slide con el id " + id + " no existe",
        error: "No existe un slide con ese ID"
      });
    }

    res.status(200).json({
      ok: true,
      slide: slideBorrado
    });
  });
});

// =============================
// Crear un slide nuevo
// =============================

app.put("/slide/:id", (req, res) => {
  var id = req.params.id;
  var ppt = req.files.route_slide;
  // Obtener el nombre del archivo
  var pptNombreCortado = ppt.name.split(".");
  var pptExtensionArchivo = pptNombreCortado[pptNombreCortado.length - 1];
  var icon = req.files.route_image;
  var iconNombreCortado = icon.name.split(".");
  var iconExtensionArchivo = iconNombreCortado[iconNombreCortado.length - 1];

  // TIPOS DE EXTENSIONES
  var iconExtensionesValidas = ["png", "jpg", "jpeg", "ico"];
  var pptExtensionesValidas = ["ppt", "pptx", "ppsx", "psmp", "pps"];

  if (iconExtensionesValidas.indexOf(iconExtensionArchivo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "Extension no valida",
      error: {
        mensaje:
          "Las extensiones validas son " + iconExtensionesValidas.join(", ")
      }
    });
  }
  if (pptExtensionesValidas.indexOf(pptExtensionArchivo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "Extension no valida",
      error: {
        mensaje:
          "Las extensiones validas son " + pptExtensionesValidas.join(", ")
      }
    });
  }
    //Nombre de archivo personalizada
    var iconNombreArchivo = `${new Date().getMilliseconds()}.${iconExtensionArchivo}`;
    var pptNombreArchivo = `${new Date().getMilliseconds()}.${pptExtensionArchivo}`;

    //mover archivo
    var iconPath = `./uploads/slides/${iconNombreArchivo}`;
    icon.mv(iconPath, err => {
      if (err) {
        res.status(500).json({ ok: false });
      }
    });
    var pptPath = `./uploads/powerPoints/${pptNombreArchivo}`;
    ppt.mv(pptPath, err => {
      if (err) {
        res.status(500).json({ ok: false });
      }
    });


  //Crear un slide
  var slide = new Slide({
    fecha: moment().format("YYYY/MM/DD HH:mm:ss"),
    route_slide: `https://ikusi-proyect.herokuapp.com/powerPoints/${pptNombreArchivo}`,
    route_image: `https://ikusi-proyect.herokuapp.com/slides/${iconNombreArchivo}`,
    video: req.files.video ? req.files.video : null
  });

  slide.save();

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

    button.slide = slide;

    button.save((err, slideGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al guardar slide",
          error: err
        });
      }

        res.status(200).json({ ok: true, message: 'Slide guardado', slide: slideGuardado });
    });
  });
});

module.exports = app;
