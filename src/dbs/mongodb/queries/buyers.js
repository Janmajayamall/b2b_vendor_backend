const {
    generatePasswordHash,
    constants,
    getInsertOneResult,
    issueJwt,
    verifyPasswordHash
} = require("./../../../utils/index")
const { ObjectID } = require("mongodb")

async function registerBuyer(dbs, queries, registrationObject, companyId) {
    //checking whether email exists or not
    const emailCheckRes = await dbs.mainDb.client.collection(dbs.mainDb.collections.buyers).findOne({
        emailId: registrationObject.emailId.trim().toLowerCase()
    })

    //if email exists, then return with error
    if (emailCheckRes) {
        return {
            error: constants.errorCodes.emailExists
        }
    }

    //register buyer
    const passwordHash = await generatePasswordHash(registrationObject.password.trim())
    let result = await dbs.mainDb.client.collection(dbs.mainDb.collections.buyers).insertOne({
        emailId: registrationObject.emailId.trim().toLowerCase(),
        passwordHash: passwordHash,
        companyId: ObjectID(companyId),
        createdAt: new Date(),
        lastModified: new Date(),
        status: "ACTIVE"
    })
    result = getInsertOneResult(result)

    //create buyer Profile
    const profileCreateRes = await queries.mongoDbQueries.createBuyerProfile(
        dbs,
        registrationObject,
        result._id,
        companyId
    )

    if (profileCreateRes === false) {
        console.log("Error in creating buyer profile on buyer account sign up")
    }

    return {
        error: constants.errorCodes.noError
    }
}

async function loginBuyer(dbs, queries, loginObject) {
    //get the buyer account
    const result = await dbs.mainDb.client.collection(dbs.mainDb.collections.buyers).findOne({
        emailId: loginObject.emailId.trim().toLowerCase()
    })

    //check whether account exists or not, if no account then return
    if (!result) {
        return {
            error: constants.errorCodes.emailDoesNotExists
        }
    }
    console.log(result, "login buyer")
    //verify the password
    const passwordVeriRes = await verifyPasswordHash(result.passwordHash, loginObject.password.trim())
    if (passwordVeriRes === true) {
        //register jwt & return
        const jwt = await issueJwt(result._id)

        //TODO: check whether profile of the buyer exists or not
        const profileExists = await queries.mongoDbQueries.getBuyerProfile(dbs, result._id)

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
    registerBuyer,
    loginBuyer
}
