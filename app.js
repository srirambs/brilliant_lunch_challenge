const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./utilities/logger')
const userRouter = require('./route/userRouter');
const roleRouter = require('./route/roleRouter');
const orgRouter = require('./route/orgRouter');

const app = express();

app.use(function(request, response, next) {
    logger.info(`Request for ${request.url} at ${new Date()}.`)
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use('/user', userRouter);
app.use('/role', roleRouter);
app.use('/organization', orgRouter);

let port = 5030;
app.listen(port, () => {
    logger.info(`Server started in port ${port} at ${new Date()}.`)
})

module.exports = app;