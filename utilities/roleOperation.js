const userDAO = require('../dao/userDAO');
const orgDAO = require('../dao/roleDAO');
const logger = require('./logger');

//Async function to handle getting role details
async function getRole(request, response) {
    let dbClient = userDAO.getConnection();
    let jsonData = request.params;
    try {
        let orgData = await orgDAO.getRoleDetails(dbClient, jsonData.organizationId);
        if (orgData.length == 1) {
            let result = {
                errorCode: 0,
                message: "OK",
                data: { ...orgData[0] }
            }
            response.status(200).send(result);
        } else {
            response.status(404).send({ errorCode: 404, message: "Record Not found", data: [] });
        }

    } catch (err) {
        logger.error(`Get Role request errored due to ${err.message}}.`);
        response.status(400).send({
            errorCode: 400,
            message: err.message
        });
    } finally {
        dbClient.end();
    }
}

//Async function to handle creation of role
async function createRole(request, response) {
    let dbClient = userDAO.getConnection();
    let jsonData = request.body;
    try {
        await orgDAO.createRole(dbClient, jsonData.roleName)
        response.status(200).send({ errorCode: 0, message: `Role Created`, });

    } catch (err) {
        logger.error(`Create Role request errored due to ${err.message}}.`);
        response.status(400).send({
            errorCode: 400,
            message: err.message
        })
    } finally {
        dbClient.end();
    }
}

module.exports.getRole = getRole;
module.exports.createRole = createRole;