// const http = require("http");
const express = require("express");
const app = express();

app.use(express.json());

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
  person = {
    ...person,
    id: id,
  };

  persons = [...persons, person];

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(persons));
// });

// const PORT = 3001;
// app.listen(PORT);
// console.log(`Server running on port ${PORT}.`);
