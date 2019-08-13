const Router = require('express').Router;
const roleOp = require('../utilities/roleOperation');

const router = Router();

router.post('/create', (request, response) => {
    roleOp.createRole(request, response);
})

router.get('/:organizationId', (request, response) => {
    roleOp.getRole(request, response);
})

//Handles all other API request URI
router.all('/', (request, response) => {
    response.status(400).send({
        errorCode: 400,
        message: `Invalid API request`
    })
})

module.exports = router;