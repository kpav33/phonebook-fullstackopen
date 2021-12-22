// Check earlier commits to see how the code looked like before using MongoDB as database
// dotenv imported before Person model, ensures that enviroment variables from .env are available globally
require("dotenv").config();
// const http = require("http");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
// Import database model
const Person = require("./models/person");

// Add morgan token so that it shows the data sent in HTTP POST request
morgan.token("showPostData", (request, response) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  } else {
    return " ";
  }
});

// Middleware
// Set express to show static content (display the frontend from the build directory to the root page)
app.use(express.static("build"));
// Allow request from other origins
app.use(cors());
// Parse incoming requests with incoming JSON payloads so that you can access it in request.body
app.use(express.json());

// Error handler middleware
const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// Morgan configuration for part3 exercise 3.8. by using custom tokens formats
// https://github.com/expressjs/morgan#tiny
// https://github.com/expressjs/morgan#use-custom-token-formats
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :showPostData"
  )
);
// Use middleware morgan with the tiny configuration
// https://github.com/expressjs/morgan
// app.use(morgan("tiny"));

// Root page
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// Info page
app.get("/info", (request, response, next) => {
  // Return number of documents in the collection
  Person.count({})
    .then((count) => {
      const date = new Date();
      const html = `<div>
                      <p>Phonebook has info for ${count} people.</p>
                      <p>${date}</p>
                    </div>`;
      response.send(html);
    })
    .catch((error) => next(error));
});

// Display all resources in JSON page
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// Display a resource in JSON page
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// Delete a resource
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Add a resource
app.post("/api/persons", (request, response, next) => {
  let person = request.body;

  if (person.name === undefined || person.number === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const personData = new Person({
    name: person.name,
    number: person.number,
  });

  personData
    .save()
    // Many route handlers change the response data into the right format by implicitly calling toJSON() method
    // You can also do this explicitly as shown below, but it is not necessary
    // This code could skip the toJSON() method and simply be .then(savedPerson => response.json(savedPerson))
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedAndFormattedPerson) => {
      response.json(savedAndFormattedPerson);
    })
    .catch((error) => next(error));
});

// Update a persons number
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Example of defining middleware after routes
// Example of catching requests made to non-existent routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
// Error handler must be the last loaded middleware
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(persons));
// });

// const PORT = 3001;
// app.listen(PORT);
// console.log(`Server running on port ${PORT}.`);
