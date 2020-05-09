const { v4: uuidv4 } = require("uuid")
const tableSchemas = require("./../../tableSchemas")
const { generatePasswordHash } = require("./../utils/index")

async function registerBuyer(clients, registrationObject) {
    const passwordHash = await generatePasswordHash(registrationObject.password)
    const item = {
        TableName: tableSchemas.buyers.tableName,
        Item: {
            emailId: {
                S: registrationObject.emailId
            },
            passwordHash: {
                S: passwordHash
            },
            id: {
                S: uuidv4()
            },
            createdAt: {
                N: String(new Date().getTime())
            },
            lastModified: {
                N: String(new Date().getTime())
            },
            status: {
                S: "ACTIVE"
            }
        },
        ConditionExpression: "attribute_not_exists(emailId) AND attribute_not_exists(id)"
    }

    //creating the item
    try {
        const result = await clients.dynamodbClient.putItem(item).promise()
        console.log(result)
        return true
    } catch (e) {
        console.log("error in registerBuyer() resolvers: ", e)
        return false
    }
}
module.exports = {
    registerBuyer
}
