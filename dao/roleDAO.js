const logger = require('../utilities/logger')
const mysql = require('mysql');
const Joi = require('@hapi/joi');

//Schema for role Id Validation
const idValidationSchema = Joi.object().keys({
    roleId: Joi.number().required()
})

//Function to get user role details
function getRoleDetails(dbClient, roleId) {
    return new Promise((resolve, reject) => {
        let valResult = Joi.validate({ roleId }, idValidationSchema);
        if (valResult.error !== null) {
            reject({ message: valResult.error.name + ": " + valResult.error.details[0].message });
            return;
        }
        dbClient.query(`SELECT * from MapRole WHERE roleId = ${roleId};`, function (err, results, fields) {
            if (err) {
                logger.error(`Get Role Details query errored due to ${err.message}}.`);
                reject(err);
                return;
            }
            let roleData = []
            if (results.length > 0) {
                results.forEach(result => {
                    roleData.push({
                        RoleId: result.roleId,
                        Role: result.RoleName,
                    });
                })
            }
            resolve(roleData);
        });
    });
}

//Function to create user role
function createRole(dbClient, roleName) {
    return new Promise((resolve, reject) => {
        dbClient.query(`INSERT INTO MapRole(RoleName) values('${roleName}');`, function (err, result) {
            if (err) {
                logger.error(`Insert login user query errored due to ${err.message}}.`);
                reject(err);
                return;
            }
            resolve();
        });
    });
}

module.exports.getRoleDetails = getRoleDetails;
module.exports.createRole = createRole;