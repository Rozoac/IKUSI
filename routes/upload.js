var express = require("express");
//var fileUpload = require("express-fileupload");
var fs = require("fs");

var app = express();

//app.use(fileUpload());

var Usuario = require("../models/usuario");


app.put("/:tipo/:id", (req, res, next) => {
  var tipo = req.params.tipo;
  var id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: "No seleciono una imagen",
      error: {
        mensaje: "Debe seleccionar una imagen"
      }
    });
  }
  // Obtener el nombre del archivo
  var archivo = req.files.imagen;
  var nombreCortado = archivo.name.split(".");
  var extensionArchivo = nombreCortado[nombreCortado.length - 1];

  // TIPOS DE EXTENSIONES
  var extensionesValidas = ["png", "jpg", "jpeg"];

  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "Extension no valida",
      error: {
        mensaje: "Las extensiones validas son " + extensionesValidas.join(", ")
      }
    });
  }

  //Nombre de archivo personalizada
  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

  //mover archivo
  var path = `./uploads/${tipo}/${nombreArchivo}`;
  archivo.mv(path, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al mover el archivo",
        error: err
      });
    }

    subirPorTipo(tipo, id, nombreArchivo, res);
  });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
  if (tipo === "usuarios") {
    Usuario.findById(id, (err, usuario) => {
      if (!usuario) {
        return res.status(400).json({
          ok: true,
          mensaje: "Usuario no existe",
          error: { mensaje: "Usuario no existe" }
        });
      }

      var pathViejo = "./uploads/usuarios/" + usuario.img;
      // si existe elimina la imagen anterior
      // if (fs.existsSync(pathViejo)) {
      //   fs.unlink(pathViejo);
      // }

      usuario.img = nombreArchivo;
      usuario.save((err, usuarioActualizado) => {
        usuarioActualizado.password = ":) .!.";
        return res.status(200).json({
          ok: true,
          mensaje: "Imagen de usuario actualizada",
          usuario: usuarioActualizado
        });
      });
    });
  }
  
}

module.exports = app;
