const { v4: uuidv4 } = require("uuid")
const tableSchemas = require("./../../tableSchemas")

async function createCompanyProfile(clients, registrationObject, companyId) {
    //creating item
    const item = {
        TableName: tableSchemas.companyProfiles.tableName,
        Item: {
            id: companyId,
            name: registrationObject.name.trim(),
            country: registrationObject.country.trim(),
            city: registrationObject.city.trim(),
            address: registrationObject.address.trim(),
            description: registrationObject.description.trim(),
            locationCoordinates: {
                lat: registrationObject.locationCoordinates.lat,
                lon: registrationObject.locationCoordinates.lon
            },
            contactEmailId: registrationObject.contactEmailId.trim(),
            contactNumber: registrationObject.contactNumber.trim(),
            website: registrationObject.website.trim(),
            linkedIn: registrationObject.linkedIn.trim(),
            createdAt: new Date().getTime(),
            lastModified: new Date().getTime(),
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
        console.log("error in createCompanyProfile() resolvers: ", e)
        return false
    }
}

async function getCompanyProfile(clients, companyId) {
    const result = await clients.dynamodbClient
        .get({
            TableName: tableSchemas.companyProfiles.tableName,
            Key: {
                id: companyId
            }
        })
        .promise()

    return result
}

module.exports = {
    createCompanyProfile,
    getCompanyProfile
}
