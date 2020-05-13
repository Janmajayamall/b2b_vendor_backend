import { ObjectID } from "mongodb"
import { constants } from "./../../../utils/index"

async function createCompanyProfile(dbs, registrationObject, companyId) {
    //check whether company profile with companyId exists or not
    const checkProfileRes = await dbs.mongoDb.client.collection(dbs.mongoDb.collections.companyProfiles).findOne({
        companyId: ObjectID(companyId)
    })

    //if profile exists, then ask to edit & return
    if (checkProfileRes) {
        return {
            error: constants.errorCodes.profileAlreadyCreated
        }
    }

    //create the profile
    const result = await dbs.mongoDb.client.collection(dbs.mongoDb.collections.companyProfiles).insertOne({
        companyId: ObjectID(companyId),
        name: registrationObject.name.trim(),
        country: registrationObject.country.trim(),
        city: registrationObject.city.trim(),
        state: registrationObject.state.trim(),
        address: registrationObject.address.trim(),
        description: registrationObject.description.trim(),
        locationCoordinates: [registrationObject.locationCoordinates.lon, registrationObject.locationCoordinates.lat],
        contactEmailId: registrationObject.contactEmailId.trim(),
        contactNumber: registrationObject.contactNumber.trim(),
        website: registrationObject.website.trim(),
        linkedIn: registrationObject.linkedIn.trim(),
        createdAt: new Date(),
        lastModified: new Date(),
        status: "ACTIVE"
    })

    return true
}

async function getCompanyProfile(dbs, companyId) {
    const result = await dbs.mongoDb.client.collection(dbs.mongoDb.collections.companyProfiles).findOne({
        companyId: ObjectID(companyId)
    })

    return result
}

module.exports = {
    createCompanyProfile,
    getCompanyProfile
}
