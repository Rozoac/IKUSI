var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const { ObjectId } = Schema.Types;

var menuSchema = new Schema({
  title: { type: String },
  principal: { type: Boolean ,default: false },
  button: [{type: ObjectId, ref: 'Button'}]
});

module.exports = mongoose.model("Menu", menuSchema);