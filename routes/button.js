var express = require("express");
var Button = require("../models/button");
var mdMenu = require("../middlewares/menu");
var moment = require("moment");
var fs = require("fs");
var app = express();

// =============================
// BORRAR UN BOTON
// =============================

app.delete("/button/:id", (req, res) => {
  var id = req.params.id;

  Button.findByIdAndRemove(id, (err, botonBorrado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al eliminar un boton",
        error: err
      });
    }

    if (!botonBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "El boton con el id " + id + " no existe",
        error: "No existe un boton con ese ID"
      });
    }

    res.status(200).json({
      ok: true,
      boton: botonBorrado
    });
  });
});

// =============================
// OBTENER TODOS LOS BOTTONS
// =============================

app.get("/button", (req, res) => {


    Button.find({}, 'url fecha text route_image menu slide')
      .populate("url", 'direccion autenticacion')
      .populate("menu")
      .populate("slide", 'fecha route_slide route_image video')
      .exec((err, buttons) => {
        if (err) {
          return res
            .status(500)
            .json({
              ok: false,
              mensaje: "Error cargando buttons",
              error: err
            });
        }

          res.status(200).json({
              buttons
            });
        });
});

// =============================
// Crear un botton nuevo
// =============================

app.post("/button/:id", mdMenu.menuMiddleware, (req, res) => {

  var menu = req.menu;
  // Obtener el nombre del archivo
  var archivo = req.files.route_image;
  var nombreCortado = archivo.name.split(".");
  var extensionArchivo = nombreCortado[nombreCortado.length - 1];

  // TIPOS DE EXTENSIONES
  var extensionesValidas = ["png", "jpg", "jpeg", "ico"];

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
  var nombreArchivo = `${new Date().getMilliseconds()}.${extensionArchivo}`;

  //mover archivo
  var path = `./uploads/buttons/${nombreArchivo}`;
  archivo.mv(path, err => {
    if (err) {
      res.status(500).json({ ok: false });
    }
  });

  var button = new Button({
    fecha: moment().format("YYYY/MM/DD HH:mm:ss"),
    text: req.body.text,
    route_image: `https://ikusi-proyect.herokuapp.com/buttons/${nombreArchivo}`,
    url: req.body.url ? req.body.url : null,
    menu: req.body.menu ? req.body.menu : null,
    slide: req.body.slide ? req.body.slide : null
  });
  button.save();
  menu.button.push(button);
  menu.save((err, botonGuardado) => {
    res.status(200).json({
      ok: true
    });
  });
});

// =============================
// Editar un botton
// =============================

app.put("/:id/button", (req, res) => {
  var id = req.params.id;
  var body = req.body;
  var icon = req.files
  var text;
  if (body.text) {
    text = body.text;
  } else {
    text = null;
  }

  if(icon){
    // Obtener el nombre del archivo
    var archivo = req.files.route_image;
    var nombreCortado = archivo.name.split(".");
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];
  
    // TIPOS DE EXTENSIONES
    var extensionesValidas = ["png", "jpg", "jpeg", 'ico'];
  
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
    var nombreArchivo = `${new Date().getMilliseconds()}.${extensionArchivo}`;


    //mover archivo
    var path = `./uploads/buttons/${nombreArchivo}`;
    archivo.mv(path, err => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al mover el archivo",
          error: err
        });
      }

      subir_img_text(id, nombreArchivo, res, text);
    });

  }

  
  if (text != null && !icon) {
  subir_img_text(id, null, res, text);
}


});


function subir_img_text(id, nombreArchivo, res, text){


  Button.findById(id, (err, button) => {
    if (!button) {
      return res.status(400).json({
        ok: true,
        mensaje: "Button no existe",
        error: { mensaje: "Usuario no existe" }
      });
    }
    if (nombreArchivo !== null) {
      var pathViejo = "./uploads/buttons/" + button.route_image;
      // si existe elimina la imagen anterior
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo);
      }
      button.route_image = `https://ikusi-proyect.herokuapp.com/buttons/${nombreArchivo}`;
    }
   
   
    if(text !== null){
      button.text = text;
    }
    button.fecha = moment().format("YYYY/MM/DD HH:mm:ss");
    
    button.save((err, buttonActualizado) => {
      return res
        .status(200)
        .json({
          ok: true,
          mensaje: "Datos del button actualizados",
          usuario: buttonActualizado
        });
    });



})
}
module.exports = app;
