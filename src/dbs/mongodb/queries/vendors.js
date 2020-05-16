const {
    generatePasswordHash,
    constants,
    getInsertOneResult,
    issueJwt,
    verifyPasswordHash
} = require("./../../../utils/index")
const { ObjectID } = require("mongodb")

async function registerVendor(dbs, queries, registrationObject, companyId) {
    console.log(registrationObject, companyId)
    //checking whether email exists or not
    const emailCheckRes = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendors).findOne({
        emailId: registrationObject.emailId.trim().toLowerCase()
    })

    //if email exists, then return with error
    if (emailCheckRes) {
        return {
            error: constants.errorCodes.emailExists
        }
    }

    //register vendor
    const passwordHash = await generatePasswordHash(registrationObject.password.trim())
    let result = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendors).insertOne({
        emailId: registrationObject.emailId.trim().toLowerCase(),
        passwordHash: passwordHash,
        companyId: ObjectID(companyId),
        createdAt: new Date(),
        lastModified: new Date(),
        status: "ACTIVE"
    })
    result = getInsertOneResult(result)

    //create vendor Profile
    const profileCreateRes = await queries.mongoDbQueries.createVendorProfile(
        dbs,
        registrationObject,
        result._id,
        companyId
    )

    if (profileCreateRes === false) {
        console.log("Error in creating vendor profile on vendor account sign up")
    }

    return {
        error: constants.errorCodes.noError
    }
}

async function loginVendor(dbs, queries, loginObject) {
    //get the company account
    const result = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendors).findOne({
        emailId: loginObject.emailId.trim().toLowerCase()
    })

    //check whether account exists or not, if no account then return
    if (!result) {
        return {
            error: constants.errorCodes.emailDoesNotExists
        }
    }

    //verify the password
    const passwordVeriRes = await verifyPasswordHash(result.passwordHash, loginObject.password.trim())
    if (passwordVeriRes === true) {
        //register jwt & return
        const jwt = await issueJwt(result._id)

        //TODO: check whether profile of the vendor exists or not
        const profileExists = await queries.mongoDbQueries.getVendorProfile(dbs, result._id)

        return {
            jwt: jwt,
            profileCreated: profileExists !== null ? true : false,
            error: constants.errorCodes.noError
        }
    } else {
        return {
            error: constants.errorCodes.invalidCreds
        }
    }
}

module.exports = {
    registerVendor,
    loginVendor
}
