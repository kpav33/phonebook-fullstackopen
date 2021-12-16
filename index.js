// const http = require("http");
const express = require("express");
const app = express();

const persons = [
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

// All resources in JSON page
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// Single resouce in JSON page
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

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(persons));
// });

// const PORT = 3001;
// app.listen(PORT);
// console.log(`Server running on port ${PORT}.`);
