const { v4: uuidv4 } = require("uuid")
const tableSchemas = require("./../../tableSchemas")
const { generatePasswordHash, constants, issueJwt, verifyPasswordHash } = require("./../utils/index")

async function registerVendor(clients, queries, registrationObject, companyId) {
    const passwordHash = await generatePasswordHash(registrationObject.password.trim())
    const vendorId = uuidv4()
    const item = {
        TableName: tableSchemas.vendors.tableName,
        Item: {
            emailId: registrationObject.emailId.trim(),
            passwordHash: passwordHash,
            id: vendorId,
            companyId: companyId,
            createdAt: new Date().getTime(),
            lastModified: new Date().getTime(),
            status: "ACTIVE"
        },
        ConditionExpression: "attribute_not_exists(emailId) AND attribute_not_exists(id)"
    }

    //creating the item for vendors & vendorProfiles table
    try {
        const result = await clients.dynamodbClient.put(item).promise()

        //vendorProfiles table
        const vendorProfileRes = await queries.dynamodbQueries.createVendorProfile(
            clients,
            registrationObject,
            vendorId,
            companyId
        )

        if (vendorProfileRes === false) {
            //TODO: notify that something went wrong internally
            console.log("Vendor profile not created")
        }

        return {
            error: constants.errorCodes.noError
        }
    } catch (e) {
        console.log("error in registerVendor() resolvers: ", e)
        return {
            error: constants.errorCodes.emailExists
        }
    }
}

async function loginVendor(clients, queries, loginObject) {
    //getting vendor object
    const resultObject = await clients.dynamodbClient
        .get({
            TableName: tableSchemas.vendors.tableName,
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
        //verify the password
        const passwordRes = await verifyPasswordHash(resultObject.Item.passwordHash, loginObject.password.trim())

        if (passwordRes === true) {
            //generating jwt token & sending bacl
            const jwt = await issueJwt(resultObject.Item.id)

            //checking whether profile of the buyer exists or not
            const vendorProfile = await queries.dynamodbQueries.getVendorProfile(clients, resultObject.Item.id)

            return {
                jwt: jwt,
                profileCreated: Object.keys(vendorProfile) !== 0,
                error: constants.errorCodes.noError
            }
        } else {
            return {
                error: constants.errorCodes.invalidCreds
            }
        }
    } catch (e) {
        console.log("loginVendor error:", e)
        return {
            error: constants.errorCodes.unknownError
        }
    }
}

module.exports = {
    registerVendor,
    loginVendor
}
