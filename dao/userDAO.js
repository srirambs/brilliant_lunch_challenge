const dbConfig = require('../config/dbConfig.json');
const logger = require('../utilities/logger')
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');


//Validation Schema for only User Details sent for Create User
const userDetailValidationSchema = Joi.object().keys({
    FName: Joi.string().min(2).max(50).required(),
    LName: Joi.string().min(1).max(50).required(),
    CompanyId: Joi.number().integer().required(),
    RoleId: Joi.number().integer().required(),
    Email: Joi.string().email().required(),
    SignUpTime: Joi.string().required(),
    Password: Joi.string().min(6).required()
})

//Validation Schema for only Email ID
const emailIDValidationSchema = Joi.object().keys({
    Email: Joi.string().email().required()
})

//Validation Schema for only User ID
const userIdValidationSchema = Joi.object().keys({
    userId: Joi.number().required()
})

//Function to get mysql connection
function getConnection() {
    let dbClient = mysql.createConnection({
        host: dbConfig.host,
        database: dbConfig.db,
        user: dbConfig.user,
        password: dbConfig.password
    });
    dbClient.connect();
    return dbClient;
}


// Function to get User details from End User Table
function getUserDetails(dbClient, userId, email) {
    return new Promise((resolve, reject) => {
        let valResult;
        let query = `SELECT * from EndUser WHERE`
        if (userId != null) {
            valResult = Joi.validate({ userId }, userIdValidationSchema);
            query += ` UsrId = ${userId}`;
        } else {
            valResult = Joi.validate({ Email: email }, emailIDValidationSchema);
            query += ` Email = '${email}'`;
        }
        if (valResult.error !== null) {
            reject({ message: valResult.error.name + ": " + valResult.error.details[0].message });
            return;
        }
        dbClient.query(query, function (err, results, fields) {
            if (err) {
                logger.error(`Get User Details query errored due to ${err.message}}.`);
                reject(err);
                return;
            }
            let userData = []
            if (results.length > 0) {
                results.forEach(result => {
                    userData.push({
                        UserId: result.UsrId,
                        FName: result.FName,
                        LName: result.LName,
                        CompanyId: result.OrganizationId,
                        RoleId: result.RoleId,
                        Email: result.Email,
                        SignUpTime: result.SignUpTime
                    });
                })
            }
            resolve(userData);
        });
    });
}


// Function to get User details from Log In Table
function getLoginDetails(dbClient, email) {
    return new Promise((resolve, reject) => {
        let valResult = Joi.validate({ Email: email }, emailIDValidationSchema);
        if (valResult.error !== null) {
            reject({ message: valResult.error.name + ": " + valResult.error.details[0].message });
            return;
        }
        dbClient.query(`SELECT * from log_in WHERE Email = '${email}';`, function (err, results, fields) {
            if (err) {
                logger.error(`Get Login Details query errored due to ${err.message}}.`);
                reject(err);
                return;
            }
            let loginData = []
            if (results.length > 0) {
                results.forEach(result => {
                    loginData.push({
                        Email: result.Email,
                        UserId: result.UsrId,
                        Password: result.Password
                    });
                })
            }
            resolve(loginData);
        });
    });
}

// Function to create User in the End User Table
function createEndUser(dbClient, jsondata) {
    return new Promise((resolve, reject) => {
        let valResult = Joi.validate(jsondata, userDetailValidationSchema);
        if (valResult.error !== null) {
            reject({ message: valResult.error.name + ": " + valResult.error.details[0].message });
            return;
        }
        dbClient.query(`INSERT INTO EndUser( FName , LName, OrganizationId, RoleId, Email, SignUpTime ) values 
        ('${jsondata.FName}','${jsondata.LName}',${jsondata.CompanyId}, ${jsondata.RoleId},'${jsondata.Email}' ,'${jsondata.SignUpTime}');`, function (err, result) {
                if (err) {
                    logger.error(`Insert end user query errored due to ${err.message}}.`);
                    reject(err);
                    return;
                }
                resolve();
            });
    });
}


// Function to create User in the Log In Table
function createLoginUser(dbClient, email, password, userId) {
    return new Promise((resolve, reject) => {
        dbClient.query(`INSERT INTO log_in( Email, Password, UsrId ) values 
        ('${email}','${password}',${userId});`, function (err, result) {
                if (err) {
                    logger.error(`Insert login user query errored due to ${err.message}}.`);
                    reject(err);
                    return;
                }
                resolve();
            });
    });
}


module.exports.getConnection = getConnection;
module.exports.getLoginDetails = getLoginDetails;
module.exports.getUserDetails = getUserDetails;
module.exports.createEndUser = createEndUser;
module.exports.createLoginUser = createLoginUser;