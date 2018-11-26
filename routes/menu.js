var express = require("express");
var Menu = require("../models/menu");
var Button = require("../models/button");

const fileUpload = require("express-fileupload");

var fs = require("fs");
var app = express();
app.use(fileUpload());


// =============================
// OBTENER MENU PRINCIPAL
// =============================
app.get("/principal", (req, res) => {
  Menu.find({'principal' : true}, 'button title')
    .populate({
      path: "button",
      select: 'url fecha text route_image menu slide',
      populate: {
        path: 'url',
        model: 'Url',
        select: 'autenticacion direccion'
      }
    })
    .populate({
      path: "button",
      select: 'url fecha text route_image menu slide',
      populate: {
        path: 'menu',
        model: 'Menu',
        select: 'button title',
        populate: {
          path: 'button',
          model: 'Button'
        }
      }
    })
    .populate({
      path: "button",
      select: 'url fecha text route_image menu slide',
      populate: {
        path: 'slide',
        model: 'Slide',
        select: 'fecha route_slide route_image video'
      }
    })
    .exec((err, menu) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando usuarios",
          error: err
        });
      }
      res.status(200).json({
        menu
      })
    });
  });

// =============================
// OBTENER TODOS LOS MENUS
// =============================

app.get("/menu", (req, res) => {
  Menu.find({}, "title button")
    .populate({
      path: "button",
      select: 'url fecha text route_image menu slide',
      populate: {
          path: 'url',
          model: 'Url',
          select: 'autenticacion direccion'
      }
    })
    .populate({
      path: "button",
      select: 'url fecha text route_image menu slide',
      populate: {
          path: 'menu',
          model: 'Menu',
          populate: {
            path: 'button',
            model: 'Button'
          }
      }
    })
    .populate({
      path: "button",
      select: 'url fecha text route_image menu slide',
      populate: {
          path: 'slide',
          model: 'Slide',
          select: 'fecha route_slide route_image video'
      }
    })
    
    .exec((err, menus) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando menus",
          error: err
        });
      }

      res.status(200).json({
        menus
      });
    });
});

// =============================
// Crear un MENU PRINCIPAL - solo 1
// =============================
app.post("/menu", (req, res) => {
  // mdAutenticacion.verificaToken
  var body = req.body;

  var menu = new Menu({
    title: body.title,
    principal: body.principal

  });
  menu.save((err, menuGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear un menu",
        error: err
      });
    }
    res.status(201).json({ ok: true, menu: menuGuardado });
  });
});
// =============================
// Crear un MENU 
// =============================
app.put("/menu/:id", (req, res) => {
  var id = req.params.id;
  var body = req.body;

  var menu = new Menu({
    title: body.title
  });

  menu.save();

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

    button.menu = menu;

    button.save((err, menuGuardado) => {
      if (err) {
        return res
          .status(500)
          .json({
            ok: false,
            mensaje: "Error al guardar menu",
            error: err
          });
      }

      res.status(200).json({ ok: true, url: menuGuardado.url });
    });


  });


});

// =============================
// BORRAR UN MENU
// =============================

app.delete("/menu/:id", (req, res) => {
  var id = req.params.id;

  Menu.findByIdAndRemove(id, (err, menuBorrado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al eliminar un menu",
        error: err
      });
    }

    if (!menuBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "El menu con el id " + id + " no existe",
        error: "No existe un menu con ese ID"
      });
    }

    res.status(200).json({
      ok: true,
      menu: menuBorrado
    });
  });
});

// =============================
// ACTUALIZAR MENU
// =============================

app.put("/:id/menu", (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Menu.findById(id, (err, menu) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar menu",
        error: err
      });
    }

    if (!menu) {
      return res.status(400).json({
        ok: false,
        mensaje: "El menu con el id" + id + "no existe",
        error: "No existe un menu con ese ID"
      });
    }

    menu.title = body.title;

    menu.save((err, menuGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al actualizar menu",
          error: err
        });
      }

      res.status(200).json({
        ok: true,
        menu: menuGuardado
      });
    });
  });
});

module.exports = app;
