const { v4: uuidv4 } = require("uuid")
const tableSchemas = require("./../../tableSchemas")
const { generatePasswordHash, constants } = require("./../utils/index")

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
module.exports = {
    registerVendor
}
