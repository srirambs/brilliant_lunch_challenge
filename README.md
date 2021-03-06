# Brilliant Lunch Challenge

This project is created as part of the Brilliant Lunch Challenge.

##  Overview of the work done
Following are the points that was worked upon as part of the challenge:

 - Converted the existing code to modules based on the functionality
 - Modified the Code to use relevant HTTP rest API methods
 - Standardized API response on successful as well as erroneous response with relevant error code and messages 
 - Added file based logger functionality with separate file for error responses for better trouble shooting 
 - Included API input validations and relevant error handling
 - Reduced the complexity of the DB queries by dividing to
   simpler queries thereby making it re-usable

## Assumptions:
Following are the assumptions made:

 - No restructuring of the DB tables are required as part of the challenge
 - The relationship between the tables are set thereby any faulty insertion will throw SQL error
 - EmailId Column in the End user table are assumed to be unique.

## Structure of the code

 - config folder: Contains the details of the mysql connection in json format. It can be extended to be used to store any further configuration details in same or different files based on relevance
 - dao folder: Contains the JS files related to accessing database and the files are differentiated based on the entity
 - logs folder: Auto-generated for storing log files.
 - route folder: Contains files that handles routing of the request to different modules based on the operation
 - utilities folder: Contains files that handle specific functionality
 - app.js - Index file from which the code execution starts
 - package.json - Manifest file that contains details of the project, dependencies and other informations

## Dependencies:
 - @hapi/joi : Library used for handling input validation
 - body-parser: Module to parse the input request to form usable in the code
 - express : Framework used for creating web server
 - mysql: library that facilitates connection and querying Database
 - winston: Library to help create customized logger based on requirement.

## API Details

### 1) User API Details:
**For Getting User Details**

   **URL**: http://localhost:5030/user/{user_id}   
   **Method**: GET
   
**For Creating User**

   **URL**: http://localhost:5030/user/create   
   **Method**: POST   
   **Request Body:**
   

    {
        "FName": "abcdef",
        "LName": "ghijklm",
        "CompanyId": 1,
        "RoleId": 1,
        "Email": "abcdef@test.com",
        "SignUpTime": "2019-08-12",
        "Password":"xxxxxxxxx"
    }

**For verifying User with Email**

   **URL**: http://localhost:5030/user/verify   
   **Method**: POST   
   **Request Body:**
   
    {
		"Email": "abcdef@test.com"
	}

### 2) Organization API Details:
**For Getting Organization Details**

   **URL**: http://localhost:5030/organization/{organization_id}   
   **Method**: GET
   
**For Creating Organization**

   **URL**: http://localhost:5030/organization/create   
   **Method**: POST   
   **Request Body:**
   

    {
        "orgName": "abc co"
    }


### 3) Role API Details:
**For Getting Organization Details**

   **URL**: http://localhost:5030/role/{role_id}   
   **Method**: GET
   
**For Creating Organization**

   **URL**: http://localhost:5030/role/create   
   **Method**: POST   
   **Request Body:**
   

    {
        "roleName": "abc user"
    }
