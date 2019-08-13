const userDAO = require('../dao/userDAO');
const orgDAO = require('../dao/orgDAO');
const roleDAO = require('../dao/roleDAO');
const logger = require('./logger');

//Async function to handle verify user
async function verify(request, response) {
    let dbClient = userDAO.getConnection();
    let jsonData = request.body;
    try {
        let loginData = await userDAO.getLoginDetails(dbClient, jsonData.Email)
        if (loginData.length > 0) {
            let userData = await userDAO.getUserDetails(dbClient, loginData[0].UserId, null);
            let roleData = await roleDAO.getRoleDetails(dbClient, userData[0].RoleId);
            let orgData = await orgDAO.getOrganizationDetails(dbClient, userData[0].CompanyId);

            let result = {
                errorCode: 0,
                message: "OK",
                data: { ...loginData[0], ...userData[0], ...roleData[0], ...orgData[0] }
            }
            response.status(200).send(result);
        } else {
            response.status(404).send({ errorCode: 404, message: "Unable to Find User", data: [] })
        }
    } catch (err) {
        logger.error(`Verify User request errored due to ${err.message}}.`);
        response.status(400).send({
            errorCode: 400,
            message: err.message
        });
    } finally {
        dbClient.end();
    }
}

//Async function to handle getting user details
async function getUser(request, response) {
    let dbClient = userDAO.getConnection();
    let jsonData = request.params;
    try {
        let userData = await userDAO.getUserDetails(dbClient, jsonData.UserId, null);
        if (userData.length == 1) {
            let result = {
                errorCode: 0,
                message: "OK",
                data: { ...userData[0] }
            }
            response.status(200).send(result);
        } else {
            response.status(404).send({ errorCode: 404, message: "Record Not found", data: [] });
        }

    } catch (err) {
        logger.error(`Get User request errored due to ${err.message}}.`);
        response.status(400).send({
            errorCode: 400,
            message: err.message
        });
    } finally {
        dbClient.end();
    }
}

//Async function to handle creation of user
async function createUser(request, response) {
    let dbClient = userDAO.getConnection();
    let jsonData = request.body;
    try {
        await userDAO.createEndUser(dbClient, jsonData);
        let userData = await userDAO.getUserDetails(dbClient, null, jsonData.Email);
        await userDAO.createLoginUser(dbClient, jsonData.Email, jsonData.Password, userData[0].UserId)
        if (userData.length == 1) {
            let result = {
                errorCode: 0,
                message: "OK",
                data: { ...userData[0] }
            }
            response.status(200).send(result);
        } else {
            response.status(404).send({ errorCode: 404, message: "Record Not found", data: [] });
        }

    } catch (err) {
        logger.error(`Create request errored due to ${err.message}}.`);
        response.status(400).send({
            errorCode: 400,
            message: err.message
        })
    } finally {
        dbClient.end();
    }
}
module.exports.verify = verify;
module.exports.getUser = getUser;
module.exports.createUser = createUser;