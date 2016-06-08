const express = require('express');
const bodyParser = require('body-parser');

const parser = require('./parser/index.js');

parser.run();
//const schedule = require('node-schedule');
//const j = schedule.scheduleJob('*/1 * * * *', function() {
//    parser.run();
//});

const routes = require('./routes/index');
const users = require('./routes/users');

const app = express();

app.use('/', routes);
app.use('/users', users);

app.listen(3000);

console.log("Listening on 3000");
