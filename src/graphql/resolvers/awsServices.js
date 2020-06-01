const { verifyJwt, getSignedUrlPutObject } = require("./../../utils/index")

module.exports = {
    Mutation: {
        async registerBuyer(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            //authenticate the admin user of the company
            const companyId = await verifyJwt(reqHeaders.authorization)

            //TODO: validate the input
            const registerObject = args.userInput

            const result = await queries.mongoDbQueries.registerBuyer(dbs, queries, registerObject, companyId)
            return result
        },

        async loginBuyer(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            const loginObject = args.userInput

            const result = await queries.mongoDbQueries.loginBuyer(dbs, queries, loginObject)
            return result
        }
    },
    Query: {
        async getSignedUrlPutObject(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            //authenticate the user
            await verifyJwt(reqHeaders.authorization)

            //getting fileName and fileMime
            const { fileName, fileMime } = args.userInput

            const putReqUrl = await getSignedUrlPutObject(fileName, fileMime)
            return putReqUrl
        }
    }
}
