const Router = require('express').Router;
const userOp = require('../utilities/userOperation');

const router = Router();

router.post('/verify', (request, response) => {
    userOp.verify(request, response);
})

router.post('/create', (request, response) => {
    userOp.createUser(request, response);
})

router.get('/:UserId', (request, response) => {
    userOp.getUser(request, response);
})

//Handles all other API request URI
router.all('/', (request, response) => {
    response.status(400).send({
        errorCode: 400,
        message: `Invalid API request`
    })
})

// export default router;
module.exports = router;