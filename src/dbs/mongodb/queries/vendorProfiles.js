const { ObjectID } = require("mongodb")
const { constants } = require("./../../../utils/index")
async function createVendorProfile(dbs, registrationObject, vendorId, companyId) {
    try {
        //check if profile already exists
        const checkProfileRes = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorProfiles).findOne({
            vendorId: ObjectID(vendorId)
        })

        if (checkProfileRes) {
            return true
        }

        //create profile
        const result = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorProfiles).insertOne({
            vendorId: ObjectID(vendorId),
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
        console.log("createVendorProfile mongoDb vendorProfile.js error: ", e)
        return false
    }
}

async function getVendorProfile(dbs, vendorId) {
    const result = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorProfiles).findOne({
        vendorId: ObjectID(vendorId)
    })
    return result
}

module.exports = {
    createVendorProfile,
    getVendorProfile
}
