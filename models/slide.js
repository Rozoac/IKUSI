var mongoose = require("mongoose");
var schema = mongoose.Schema;
const { ObjectId } = schema.Types;

var slideSchema = new schema({
  fecha: {
    type: String,
    required: true,
    url: String
  },
  route_slide: { type: String },
  route_image: { type: String },
  video: [{
    fecha: { type: String, required: true, url: String },
    page: { type: Number },
    route_video: { type: String }
  }]
});

module.exports = mongoose.model("Slide", slideSchema);
