const { v4: uuidv4 } = require("uuid")
const tableSchemas = require("../../tableSchemas")

async function createVendorProfile(clients, registrationObject, vendorId, companyId) {
    //creating item
    const item = {
        TableName: tableSchemas.vendorProfiles.tableName,
        Item: {
            id: vendorId,
            name: registrationObject.name.trim(),
            contactEmailId: registrationObject.contactEmailId.trim(),
            contactNumber: registrationObject.contactNumber.trim(),
            createdAt: new Date().getTime(),
            lastModified: new Date().getTime(),
            companyId: companyId,
            status: "ACTIVE"
        },
        ConditionExpression: "attribute_not_exists(id)"
    }

    //creating the item
    try {
        const result = await clients.dynamodbClient.put(item).promise()
        console.log(result)
        return true
    } catch (e) {
        console.log("error in createVendorProfile() resolvers: ", e)
        return false
    }
}

async function getVendorProfile(clients, vendorId) {
    const result = await clients.dynamodbClient
        .get({
            TableName: tableSchemas.vendorProfiles.tableName,
            Key: {
                id: vendorId
            }
        })
        .promise()
    return result
}

module.exports = {
    createVendorProfile,
    getVendorProfile
}
