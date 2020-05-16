const { verifyJwt } = require("./../../utils/index")

module.exports = {
    Mutation: {
        async registerVendor(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            //authenticate the user
            const companyId = await verifyJwt(reqHeaders.authorization)

            //TODO: validate the input
            const registerObject = args.userInput

            const result = await queries.mongoDbQueries.registerVendor(dbs, queries, registerObject, companyId)
            return result
        },

        async loginVendor(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            //TODO: validate the input
            const loginObject = args.userInput

            const result = await queries.mongoDbQueries.loginVendor(dbs, queries, loginObject)
            return result
        }
    },

    Query: {
        async s(parent, args, context) {
            //TODO: validate the input
            const registerVendorsObject = args.userInput

            // const result = await dynamodbQueries.registerVendors(context.dynamodbClient, registerVendorsObject)
            return true
        }
    }
}
