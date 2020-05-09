const { v4: uuidv4 } = require("uuid")
const tableSchemas = require("./../../tableSchemas")

async function createBuyerProfile(clients, registrationObject, buyerId) {
    //creating item
    const item = {
        TableName: tableSchemas.buyerProfiles.tableName,
        Item: {
            id: {
                S: buyerId
            },
            name: {
                S: registrationObject.name
            },
            contactEmailId: {
                S: registrationObject.contactEmailId
            },
            contactNumber: {
                S: registrationObject.contactNumber
            },
            createdAt: {
                N: String(new Date().getTime())
            },
            lastModified: {
                N: String(new Date().getTime())
            },
            companyId: {
                S: registrationObject.companyId
            },
            status: {
                S: "ACTIVE"
            }
        },
        ConditionExpression: "attribute_not_exists(id)"
    }

    //creating the item
    try {
        const result = await clients.dynamodbClient.putItem(item).promise()
        console.log(result)
        return true
    } catch (e) {
        console.log("error in createBuyerProfile() resolvers: ", e)
        return false
    }
}

module.exports = {
    createBuyerProfile
}
