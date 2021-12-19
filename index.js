// const http = require("http");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

// Add morgan token so that it shows the data sent in HTTP POST request
morgan.token("showPostData", (request, response) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  } else {
    return " ";
  }
});

// Middleware
// Allow request from other origins
app.use(cors());
// Parse incoming requests with incoming JSON payloads so that you can access it in request.body
app.use(express.json());
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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// Root page
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// Info page
app.get("/info", (request, response) => {
  const date = new Date();
  const html = `<div>
                    <p>Phonebook has info for ${persons.length} people.</p>
                    <p>${date}</p>
                </div>`;
  response.send(html);
});

// Display all resources in JSON page
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// Display a resource in JSON page
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    // Display custom error message as part of body content
    // response
    //   .status(404)
    //   .send(`Person with id ${id} not found on server.`)
    //   .end();
    // Display custom error message in the header of the response
    response.statusMessage = `Person with id ${id} not found on server.`;
    response.status(404).end();
  }
});

// Delete a resource
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

// Add a resource
app.post("/api/persons", (request, response) => {
  const id = Math.floor(Math.random() * (1001 - 0 + 1) + 0);
  let person = request.body;

  const findDuplicateName = persons.find(
    (item) => item.name.toLowerCase() === person.name.toLowerCase()
  );

  if (!person.name) {
    response.statusMessage = "Missing name property";
    return response.status(400).json({
      error: "Name missing",
    });
  } else if (!person.number) {
    response.statusMessage = "Missing number property";
    return response.status(400).json({
      error: "Number missing",
    });
  } else if (findDuplicateName) {
    response.statusMessage = `Person with name ${person.name} already present in the phonebook`;
    return response.status(400).json({
      error: "Duplicate name",
    });
  }

  person = {
    name: person.name,
    number: person.number,
    id: id,
  };

  persons = [...persons, person];

  response.json(person);
});

// Example of defining middleware after routes
// Example of catching requests made to non-existent routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(persons));
// });

// const PORT = 3001;
// app.listen(PORT);
// console.log(`Server running on port ${PORT}.`);
