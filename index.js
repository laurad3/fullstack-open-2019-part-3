'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001;
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Body:', req.body);
    console.log('---');
    next();
};

app.use(requestLogger);

morgan.token('body', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body);
    }
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    {
        name: 'Arto Hellas',
        number: '040-123456',
        id: 1
    },
    {
        name: 'Ada Lovelace',
        number: '39-44-5323523',
        id: 2
    },
    {
        name: 'Dan Abramov',
        number: '12-43-234345',
        id: 3
    },
    {
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
        id: 4
    },
];

const generateId = () => {
    const randomId = Math.floor(Math.random() * 100) + 1;

    return randomId;
};

app.get('/info', (req, res) => {
    const count = persons.length;
    res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date}</p>`);
});

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const entry = persons.find(person => person.id === id);

    if (entry) {
        res.json(entry)
    } else {
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons.filter(person => person.id !== id);

    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
    const name = body.name;
    const number = body.number;

    if (!name || !number) {
        return res.status(400).json({
            error: 'name or number data are missing'
        });
    }

    if (persons.find(person => name === person.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name,
        number,
        id: generateId(),
    };

    persons = persons.concat(person);

    res.json(persons);
});

const unknownEndpoint = (req, res) => {
    res.status(404).send({
        error: 'unknown endpoint'
    });
};

app.use(unknownEndpoint);

app.listen(PORT, () => {
	console.log(`Server runnin on port ${PORT}`);	
});
