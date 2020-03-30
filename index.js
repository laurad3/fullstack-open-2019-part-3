'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Person = require('./models/person');
const PORT = 3001;
const cors = require('cors');

app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());
// app.use(logger); // request.body is empty

const generateId = () => {
    const randomId = Math.floor(Math.random() * 100) + 1;

    return randomId;
};

app.get('/info', (req, res) => {
    const count = Person.length;
    res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date}</p>`);
});

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()));
    });
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;

    Person.findById(id).then(person => {
        if (person) {
            res.json(person.toJSON());
        } else {
            res.status(404).end();
        }
    }).catch(error => {
        console.log(error);
        res.status(404).send({ error: 'malformatted id' });
    });
});

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;

    Person.findByIdAndRemove(id).then(result => {
        res.status(204).end();
    }).catch(error => next(error));
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
    const name = body.name;
    const number = body.number;
    const id = body.id;

    if (!name || !number) {
        return res.status(400).json({
            error: 'name or number data are missing'
        });
    }

    const person = new Person({
        name,
        number,
    });

    person.save().then(savedNote => {
        res.json(savedNote.toJSON());
    });
});

app.put('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const name = body.name;
    const number = body.number;

    const person = {
        name,
        number,
    }

    Person.findByIdAndUpdate(id, person, { new: true }).then(updatedPerson => {
        res.json(updatedPerson.toJSON());
    }).catch(error => next(error));
});

const unknownEndpoint = (req, res) => {
    res.status(404).send({
        error: 'unknown endpoint'
    });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
    console.log(error.message);

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' });
    }

    next(error);
};

// handler of requests with result to errors
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server runnin on port ${PORT}`);	
});
