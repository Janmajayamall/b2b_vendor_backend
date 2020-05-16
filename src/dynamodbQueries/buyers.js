const { v4: uuidv4 } = require("uuid")
const tableSchemas = require("./../../tableSchemas")
const { generatePasswordHash, constants, issueJwt, verifyPasswordHash } = require("./../utils/index")

async function registerBuyer(clients, queries, registrationObject, companyId) {
    const passwordHash = await generatePasswordHash(registrationObject.password.trim())
    const buyerId = uuidv4()
    const item = {
        TableName: tableSchemas.buyers.tableName,
        Item: {
            emailId: registrationObject.emailId.trim(),
            passwordHash: passwordHash,
            id: buyerId,
            companyId: companyId,
            createdAt: new Date().getTime(),
            lastModified: new Date().getTime(),
            status: "ACTIVE"
        },
        ConditionExpression: "attribute_not_exists(emailId) AND attribute_not_exists(id)"
    }

    //creating the item for buyers & buyerProfiles table
    try {
        // buyers table
        const result = await clients.dynamodbClient.put(item).promise()

        // buyerProfiles tables
        const buyerProfileRes = await queries.dynamodbQueries.createBuyerProfile(
            clients,
            registrationObject,
            buyerId,
            companyId
        )

        if (buyerProfileRes === false) {
            //TODO: notify about the error internally
            console.log("Buyer profile not created")
        }

        return {
            error: constants.errorCodes.noError
        }
    } catch (e) {
        console.log("error in registerBuyer() resolvers: ", e)
        return {
            error: constants.errorCodes.emailExists
        }
    }
}

async function loginBuyer(clients, queries, loginObject) {
    //getting buyer object
    const resultObject = await clients.dynamodbClient
        .get({
            TableName: tableSchemas.buyers.tableName,
            Key: {
                emailId: loginObject.emailId.trim()
            }
        })
        .promise()

    //checking whether user exits or not
    if (Object.keys(resultObject).length === 0) {
        return {
            error: constants.errorCodes.emailDoesNotExists
        }
    }

    try {
        //verify password
        const passVeriRes = await verifyPasswordHash(resultObject.Item.passwordHash, loginObject.password.trim())

        if (passVeriRes === true) {
            //generating jwt token & sending back
            const jwt = await issueJwt(resultObject.Item.id)

            //checking whether profile of the buyer exists or not
            const buyerProfile = await queries.dynamodbQueries.getBuyerProfile(clients, resultObject.Item.id)

            return {
                jwt: jwt,
                profileCreated: Object.keys(buyerProfile).length !== 0,
                error: constants.errorCodes.noError
            }
        } else {
            return {
                error: constants.errorCodes.invalidCreds
            }
        }
    } catch (e) {
        console.log("loginBuyer error: ", e)
        return {
            error: constants.errorCodes.unknownError
        }
    }
}

module.exports = {
    registerBuyer,
    loginBuyer
}
