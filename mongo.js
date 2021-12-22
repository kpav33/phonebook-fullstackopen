const mongoose = require("mongoose");

// How to use: node mongo.js <password> "John Smith" 030-12345

// Exit process if password is not passed as parameter
if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

// Exit process if only one necessary argument is provided
if (process.argv.length === 4) {
  console.log(
    "Please provide both the name and password as an argument to add a person: node mongo.js <password> <name> <number>"
  );
  process.exit(1);
}

// Get password from the command line parameter
const password = process.argv[2];

const url = `mongodb+srv://fullstackKpav:${password}@cluster0.lg4pn.mongodb.net/phonebook-app?retryWrites=true&w=majority`;
const name = process.argv[3];
const number = process.argv[4];

mongoose.connect(url);

// Define person schema
const personSchema = new mongoose.Schema({ name: String, number: String });

// Define a matching mode to the person schema
const Person = mongoose.model("Person", personSchema);

// Create a new person object
const person = new Person({
  name,
  number,
});

// Retrieve all the people stored in the database and display them
if (process.argv.length === 3) {
  console.log("Phonebook");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
    process.exit(1);
  });
}

// Save the new person to the database
if (process.argv.length === 5) {
  person.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook.`);
    // Remember to close the connection at the end, otherwise the program will never finish execution
    mongoose.connection.close();
  });
}

// Retrieve all the people stored in the database
// Person.find({}).then((result) => {
//   result.forEach((person) => {
//     console.log(person);
//   });
//   mongoose.connection.close();
// });
