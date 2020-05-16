const {
    generatePasswordHash,
    issueJwt,
    constants,
    getInsertOneResult,
    verifyPasswordHash
} = require("./../../../utils/index")

async function registerCompany(dbs, registrationObject) {
    //checking whether emailId already exists or not
    const emailCheckRes = await dbs.mainDb.client.collection(dbs.mainDb.collections.companies).findOne({
        emailId: registrationObject.emailId.trim().toLowerCase()
    })

    //if email already exists then return
    if (emailCheckRes) {
        return {
            error: constants.errorCodes.emailExists
        }
    }

    const passwordHash = await generatePasswordHash(registrationObject.password.trim())
    //registering the company
    let result = await dbs.mainDb.client.collection(dbs.mainDb.collections.companies).insertOne({
        emailId: registrationObject.emailId.trim().toLowerCase(),
        passwordHash: passwordHash,
        createdAt: new Date(),
        lastModified: new Date(),
        status: "ACTIVE"
    })
    result = getInsertOneResult(result)

    const jwt = await issueJwt(result._id)

    return {
        jwt: jwt,
        profileCreated: false,
        error: constants.errorCodes.noError
    }
}

async function loginCompany(dbs, queries, loginObject) {
    //get the company account
    const result = await dbs.mainDb.client.collection(dbs.mainDb.collections.companies).findOne({
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

        //TODO: check whether profile of the company exists or not
        const profileExists = await queries.mongoDbQueries.getCompanyProfile(dbs, result._id)

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
    registerCompany,
    loginCompany
}
