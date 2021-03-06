const mongoose = require('mongoose');

const url = 'mongodb+srv://fullstack:mongo123@cluster0-elvwb.mongodb.net/phonebook?retryWrites=true&w=majority';

console.log('connecting to', url);

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(result => {
	console.log('connected to MongoDB');
}).catch((error) => {
	console.log('error connecting to MongoDB:', error.message);
});

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

mongoose.set('useFindAndModify', false);

module.exports = mongoose.model('Person', personSchema);