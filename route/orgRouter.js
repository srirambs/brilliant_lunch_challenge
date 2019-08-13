const Router = require('express').Router;
const orgOp = require('../utilities/orgOperation');

const router = Router();

router.post('/create', (request, response) => {
    orgOp.createOrg(request, response);
})

router.get('/:organizationId', (request, response) => {
    orgOp.getOrg(request, response);
})

//Handles all other API request URI
router.all('/', (request, response) => {
    response.status(400).send({
        errorCode: 400,
        message: `Invalid API request`
    })
})

module.exports = router;