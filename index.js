const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bluebird = require('bluebird');

const app = express();
const environment = app.get('env');

const server = http.createServer(app);

mongoose.Promise = bluebird;
mongoose.plugin(require('./lib/globalToJSON'));
mongoose.plugin(require('mongoose-unique-validator'));

const sockets = require('./lib/sockets');
const io = sockets.connect(server);

const { port, db } = require('./config/environment');
const routes = require('./config/routes');
const customResponses = require('./lib/customResponses');
const errorHandler = require('./lib/errorHandler');

mongoose.connect(db[environment], { useMongoClient: true });

app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());

app.use(customResponses);
app.use('/api', routes);
app.get('/*', (req, res) => res.sendFile(`${__dirname}/public/index.html`));
app.use(errorHandler);

if (environment !== 'test') server.listen(port, () => console.log(`Server is up and running on port: ${port}`));

module.exports = app;
