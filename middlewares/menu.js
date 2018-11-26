var Menu = require("../models/menu");

exports.menuMiddleware = function (req, res, next) {
   
        Menu.findById(req.params.id, (err, menuDB) => {
            if (err) {
                return res.status(400)
                    .json({
                        ok: false,
                        mensaje: "Menu no existe",
                        error: err
                    });
            }
            req.menu = menuDB
            next()
        })
}

