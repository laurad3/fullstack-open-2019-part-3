'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001;
const cors = require('cors');

app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());

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
    const id = body.id;

    if (!name || !number) {
        return res.status(400).json({
            error: 'name or number data are missing'
        });
    }

    if (persons.find(person => name === person.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = {
        name,
        number,
        id,
    };

    persons = persons.concat(person);

    res.json(person);
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
