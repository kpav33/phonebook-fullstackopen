const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const url = process.env.MONGODB_URI;

// console.log("connection to", url);

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB: ", error.message);
  });

// Define person schema with validation
// https://github.com/blakehaswell/mongoose-unique-validator#readme
// https://www.npmjs.com/package/mongoose-unique-validator#case-insensitive
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
    trim: true,
    minlength: 3,
  },
  number: { type: String, required: true, unique: true, minlength: 8 },
});
// Use the uniqueValidator plugin to check for duplicates
personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
