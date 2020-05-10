const { v4: uuidv4 } = require("uuid")
const tableSchemas = require("./../../tableSchemas")
const { generatePasswordHash, issueJwt, constants, verifyPasswordHash } = require("./../utils/index")

async function registerCompany(clients, registrationObject) {
    const passwordHash = await generatePasswordHash(registrationObject.password.trim())
    const companyId = uuidv4()
    const item = {
        TableName: tableSchemas.companies.tableName,
        Item: {
            emailId: registrationObject.emailId.trim(),
            passwordHash: passwordHash,
            id: companyId,
            createdAt: new Date().getTime(),
            lastModified: new Date().getTime(),
            status: "ACTIVE"
        },
        ConditionExpression: "attribute_not_exists(emailId) AND attribute_not_exists(id)"
    }

    //creating the item
    try {
        const result = await clients.dynamodbClient.put(item).promise()
    } catch (e) {
        console.log(e)
        return {
            error: constants.errorCodes.emailExists
        }
    }

    //generating jwt token & sending back
    const jwt = await issueJwt(companyId)

    return {
        jwt: jwt,
        profileCreated: false,
        error: constants.errorCodes.noError
    }
}

async function loginCompany(clients, queries, loginObject) {
    //get the company
    //generating params for req
    const req = {
        TableName: tableSchemas.companies.tableName,
        Key: {
            emailId: loginObject.emailId.trim()
        }
    }
    const resultObject = await clients.dynamodbClient.get(req).promise()

    //checking whether user exists or not
    if (Object.keys(resultObject).length === 0) {
        return {
            error: constants.errorCodes.emailDoesNotExists
        }
    }

    try {
        //verify password
        const passVeriRes = await verifyPasswordHash(resultObject.Item.passwordHash, loginObject.password)

        if (passVeriRes === true) {
            //generating jwt token & sending back
            const jwt = await issueJwt(resultObject.Item.id)

            //checking whether profile for the company exists or not
            const companyProfile = await queries.dynamodbQueries.getCompanyProfile(clients, resultObject.Item.id)

            return {
                jwt: jwt,
                profileCreated: Object.keys(companyProfile).length !== 0,
                error: constants.errorCodes.noError
            }
        } else {
            return {
                error: constants.errorCodes.invalidCreds
            }
        }
    } catch (e) {
        console.log("loginCompany error: ", e)
        return {
            error: constants.errorCodes.unknownError
        }
    }
}

module.exports = {
    registerCompany,
    loginCompany
}
