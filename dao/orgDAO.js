const logger = require('../utilities/logger')
const mysql = require('mysql');
const Joi = require('@hapi/joi');

//Schema for organization Id Validation
const idValidationSchema = Joi.object().keys({
    orgId: Joi.number().required()
})

//Function to get Organizational Data
function getOrganizationDetails(dbClient, orgId) {
    return new Promise((resolve, reject) => {
        let valResult = Joi.validate({ orgId }, idValidationSchema);
        if (valResult.error !== null) {
            reject({ message: valResult.error.name + ": " + valResult.error.details[0].message });
            return;
        }

        dbClient.query(`SELECT * from Organization WHERE OrganizationId = ${orgId};`, function (err, results, fields) {
            if (err) {
                logger.error(`Get Organization Details query errored due to ${err.message}}.`);
                reject(err);
                return;
            }
            let orgData = []
            if (results.length > 0) {
                results.forEach(result => {
                    orgData.push({
                        CompanyId: result.OrganizationId,
                        Organization: result.Name,
                    });
                })

            }
            resolve(orgData);
        });
    });
}

//Function to create Organization in Organization table
function createOrganization(dbClient, OrganizationName) {
    return new Promise((resolve, reject) => {
        dbClient.query(`INSERT INTO organization(Name) values('${OrganizationName}');`, function (err, result) {
            if (err) {
                logger.error(`Insert login user query errored due to ${err.message}}.`);
                reject(err);
                return;
            }
            resolve();
        });
    });
}

module.exports.getOrganizationDetails = getOrganizationDetails;
module.exports.createOrganization = createOrganization;