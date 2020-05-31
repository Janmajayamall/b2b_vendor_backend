const { ObjectID } = require("mongodb")
const { constants } = require("./../../../utils/index")

async function addPreferredVendor(dbs, companyId, vendorCompanyId) {
    if (companyId === vendorCompanyId) {
        return {
            error: constants.errorCodes.idsMatch
        }
    }

    //check whether preference already exists or not
    const checkRes = await dbs.mainDb.client.collection(dbs.mainDb.collections.preferredVendors).findOne({
        companyId: ObjectID(companyId),
        vendorCompanyId: ObjectID(vendorCompanyId)
    })
    if (checkRes != undefined) {
        return {
            error: constants.errorCodes.noError
        }
    }

    //insert preference
    //get companyObject
    const companyObject = await dbs.mainDb.client.collection(dbs.mainDb.collections.companyProfiles).findOne({
        companyId: ObjectID(companyId)
    })
    //get vendorCompanyObject
    const vendorCompanyObject = await dbs.mainDb.client.collection(dbs.mainDb.collections.companyProfiles).findOne({
        companyId: ObjectID(vendorCompanyId)
    })

    //if any of the company does not exists
    if (vendorCompanyObject == undefined || companyObject == undefined) {
        return {
            error: constants.errorCodes.idDoesNotExists
        }
    }

    const result = await dbs.mainDb.client.collection(dbs.mainDb.collections.preferredVendors).insertOne({
        companyId: ObjectID(companyId),
        companyName: companyObject.name,
        vendorCompanyId: ObjectID(vendorCompanyId),
        vendorCompanyName: vendorCompanyObject.name,
        createdAt: new Date(),
        lastModified: new Date(),
        status: "ACTIVE"
    })

    return {
        error: constants.errorCodes.noError
    }
}

async function removePreferredVendor(dbs, companyId, vendorCompanyId) {
    const result = await dbs.mainDb.client.collection(dbs.mainDb.collections.preferredVendors).deleteOne({
        companyId: ObjectID(companyId),
        vendorCompanyId: ObjectID(vendorCompanyId)
    })

    return {
        error: constants.errorCodes.noError
    }
}

async function companyGetPreferredVendors(dbs, companyId) {
    const result = await dbs.mainDb.client
        .collection(dbs.mainDb.collections.preferredVendors)
        .find({
            companyId: ObjectID(companyId)
        })
        .toArray()

    return result
}

async function buyerGetPreferredVendors(dbs, buyerId) {
    //get companyId
    const buyerProfileObject = await dbs.mainDb.client.collection(dbs.mainDb.collections.buyerProfiles).findOne({
        buyerId: ObjectID(buyerId)
    })
    if (buyerProfileObject == undefined) {
        return []
    }

    const preferredVendorsList = await companyGetPreferredVendors(dbs, buyerProfileObject.companyId)
    return preferredVendorsList
}

async function companyCheckPreferredVendor(dbs, companyId, vendorCompanyId) {
    const result = await dbs.mainDb.client.collection(dbs.mainDb.collections.preferredVendors).findOne({
        companyId: ObjectID(companyId),
        vendorCompanyId: ObjectID(vendorCompanyId)
    })

    if (result == undefined) {
        return false
    } else {
        return true
    }
}

module.exports = {
    addPreferredVendor,
    removePreferredVendor,
    companyGetPreferredVendors,
    buyerGetPreferredVendors,
    companyCheckPreferredVendor
}
