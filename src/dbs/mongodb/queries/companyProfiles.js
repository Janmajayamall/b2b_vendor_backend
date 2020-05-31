const { ObjectID } = require("mongodb")
const { constants } = require("./../../../utils/index")

async function createCompanyProfile(dbs, registrationObject, companyId) {
    //check whether company profile with companyId exists or not

    const checkProfileRes = await dbs.mainDb.client.collection(dbs.mainDb.collections.companyProfiles).findOne({
        companyId: ObjectID(companyId)
    })
    console.log(registrationObject, "dadadad")
    //if profile exists, then ask to edit & return
    if (checkProfileRes) {
        return {
            error: constants.errorCodes.profileAlreadyCreated
        }
    }

    //create the profile
    const result = await dbs.mainDb.client.collection(dbs.mainDb.collections.companyProfiles).insertOne({
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

    return {
        error: constants.errorCodes.noError
    }
}

async function getCompanyProfile(dbs, companyId) {
    const result = await dbs.mainDb.client.collection(dbs.mainDb.collections.companyProfiles).findOne({
        companyId: ObjectID(companyId)
    })

    return result
}

async function searchCompanyProfiles(dbs, companyId, searchInput) {
    console.log(companyId, searchInput)

    //generating search query
    let findQuery = {}
    if (searchInput.keywords.trim() !== "") {
        findQuery.name = searchInput.keywords.trim()
    }

    const result = await dbs.mainDb.client.collection(dbs.mainDb.collections.companyProfiles).find(findQuery).toArray()

    //checking for company itself
    const finalList = []
    result.forEach((object) => {
        if (!ObjectID(object.companyId).equals(ObjectID(companyId))) {
            finalList.push(object)
        }
    })
    return finalList
}

async function companyGetVendorCompanyProfile(dbs, companyId, vendorCompanyId) {
    //TODO: get the profile info of the vendorCompanyProfile

    const vendorPreferenceRes = await dbs.mainDb.client.collection(dbs.mainDb.collections.preferredVendors).findOne({
        companyId: ObjectID(companyId),
        vendorCompanyId: ObjectID(vendorCompanyId),
        status: "ACTIVE"
    })
    let preferredVendor = false
    if (vendorPreferenceRes != undefined) {
        preferredVendor = true
    }

    return {
        preferredVendor: preferredVendor
    }
}

module.exports = {
    createCompanyProfile,
    getCompanyProfile,
    searchCompanyProfiles,
    companyGetVendorCompanyProfile
}
