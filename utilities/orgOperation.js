const userDAO = require('../dao/userDAO');
const orgDAO = require('../dao/orgDAO');
const logger = require('./logger');

//Async function to handle getting organization details
async function getOrg(request, response) {
    let dbClient = userDAO.getConnection();
    let jsonData = request.params;
    try {
        let orgData = await orgDAO.getOrganizationDetails(dbClient, jsonData.organizationId);
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
        logger.error(`Get Organization request errored due to ${err.message}}.`);
        response.status(400).send({
            errorCode: 400,
            message: err.message
        });
    } finally {
        dbClient.end();
    }
}

//Async function to handle creation of organization
async function createOrg(request, response) {
    let dbClient = userDAO.getConnection();
    let jsonData = request.body;
    try {
        await orgDAO.createOrganization(dbClient, jsonData.orgName)
        response.status(200).send({ errorCode: 0, message: `Organization Created`, });

    } catch (err) {
        logger.error(`Create Organization request errored due to ${err.message}}.`);
        response.status(400).send({
            errorCode: 400,
            message: err.message
        })
    } finally {
        dbClient.end();
    }
}

module.exports.getOrg = getOrg;
module.exports.createOrg = createOrg;