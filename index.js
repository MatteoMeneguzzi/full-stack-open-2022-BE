require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const Contact = require("./models/contact");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(express.static("build"));

app.use(express.json());

app.use(requestLogger);

app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

function getRandomArbitrary(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

app.post("/api/persons", (request, response) => {
  const body = request.body;

  console.log(body);

  if (body.name === undefined) {
    return response.status(400).json({ error: "name missing" });
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact.save().then((savedContact) => {
    response.json(savedContact);
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const contact = {
    name: body.name,
    number: body.number,
  };

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
