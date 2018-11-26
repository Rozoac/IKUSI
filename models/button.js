var mongoose = require('mongoose');
var schema = mongoose.Schema;
const { ObjectId } = schema.Types;

var buttonSchema = new schema({
  fecha: {
    type: String,
    required: true,
    url: String
  },
  menu: {type: ObjectId, ref: "Menu", default: null},
  slide: {type: ObjectId, ref: "Slide", default: null},
  text: { type: String },
  route_image: { type: String},
  url: { type: ObjectId, ref: "Url", default: null }
});

module.exports = mongoose.model("Button", buttonSchema);

