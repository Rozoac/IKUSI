var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const { ObjectId } = Schema.Types;

var urlSchema = new Schema({
  autenticacion: { 
      password: { type: String },
      username: { type: String }
   },
  direccion: { type: String }
});

module.exports = mongoose.model("Url", urlSchema);
