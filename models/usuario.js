var mongoose = require('mongoose');
var schema = mongoose.Schema;

var rolesValidos = {
  values: ["ADMIN", "USER"],
  message: "{VALUE} no es un rol permitido"
};

var usuarioSchema = new schema({
    nombre: {type: String, required: [true, 'El nombre es obligatorio']},
    email: {type: String, unique:[true, 'El correo debe ser unico'], required: [true, 'El correo es obligatorio']},
    password: {type: String, required: [true, 'La contraseña es necesaria']},
    img: {type: String, required: false},
    role: { type: String, required: true, default: 'USER', enum: rolesValidos }

});

module.exports = mongoose.model("Usuario", usuarioSchema);