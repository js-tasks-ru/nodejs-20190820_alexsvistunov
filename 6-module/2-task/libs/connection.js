const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const config = require('../config');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.set('debug', false);

mongoose.plugin(beautifyUnique);

console.log('mongoose connect!');

module.exports = mongoose.createConnection(config.mongodb.uri);
