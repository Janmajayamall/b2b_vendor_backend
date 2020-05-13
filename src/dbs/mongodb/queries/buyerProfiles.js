const { ObjectID } = require("mongodb")

async function createBuyerProfile(dbs, registrationObject, buyerId, companyId) {
    try {
        //check if profile already exists
        const checkProfileRes = await dbs.mongoDb.client.collection(dbs.mongoDb.collections.buyerProfiles).findOne({
            buyerId: ObjectID(buyerId)
        })

        if (checkProfileRes) {
            return true
        }

        //create profile
        const result = await dbs.mongoDb.client.collection(dbs.mongoDb.collections.buyerProfiles).insertOne({
            buyerId: ObjectID(buyerId),
            name: registrationObject.name.trim(),
            contactEmailId: registrationObject.contactEmailId.trim(),
            contactNumber: registrationObject.contactNumber.trim(),
            createdAt: new Date(),
            lastModified: new Date(),
            companyId: ObjectID(companyId),
            status: "ACTIVE"
        })

        return true
    } catch (e) {
        console.log("createBuyerProfile mongoDb buyerProfile.js error: ", e)
        return false
    }
}

async function getBuyerProfile(dbs, buyerId) {
    const result = await dbs.mongoDb.client.collection(dbs.mongoDb.collections.buyerProfiles).findOne({
        buyerId: ObjectID(buyerId)
    })
    return result
}

module.exports = {
    createBuyerProfile,
    getBuyerProfile
}
