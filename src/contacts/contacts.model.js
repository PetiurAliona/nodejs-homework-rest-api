const mongoose = require("mongoose")
const { Schema, SchemaTypes } = mongoose

const ContactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },
})

const Contact = mongoose.model("Contact", ContactSchema)

module.exports = Contact
