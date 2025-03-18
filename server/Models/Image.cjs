const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new mongoose.Schema({
    // String representing the file name
    name: {
      type: String,
      required: true,
    },
    // string representing the MIME type
    type: {
      type: String,
      required: true,
    },
    // buffer object containing the binary image data.
    data: {
      type: Buffer,
      required: true,
    },
  },{
    collection: "images"
  });


  module.exports = mongoose.model("Image", imageSchema);