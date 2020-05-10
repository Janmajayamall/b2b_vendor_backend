const { v4: uuidv4 } = require("uuid")
const tableSchemas = require("./../../tableSchemas")

async function createBuyerProfile(clients, registrationObject, buyerId, companyId) {
    //creating item
    const item = {
        TableName: tableSchemas.buyerProfiles.tableName,
        Item: {
            id: buyerId,
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
        console.log("error in createBuyerProfile() resolvers: ", e)
        return false
    }
}

async function getBuyerProfile(clients, buyerId) {
    const result = await clients.dynamodbClient
        .get({
            TableName: tableSchemas.buyerProfiles.tableName,
            Key: {
                id: buyerId
            }
        })
        .promise()
    return result
}

module.exports = {
    createBuyerProfile,
    getBuyerProfile
}
