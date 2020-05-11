const { verifyJwt } = require("./../../utils/index")

module.exports = {
    Mutation: {
        async registerVendor(parent, args, context) {
            //extracting contexts
            const { clients, queries, reqHeaders } = context

            //authenticate the user
            const companyId = await verifyJwt(reqHeaders.authorization)

            //TODO: validate the input
            const registerObject = args.userInput

            const result = await queries.dynamodbQueries.registerVendor(clients, queries, registerObject, companyId)
            return result
        },

        async loginVendor(parent, args, context) {
            //extracting contexts
            const { clients, queries, reqHeaders } = context

            //TODO: validate the input
            const loginObject = args.userInput

            const result = await queries.dynamodbQueries.loginVendor(clients, queries, loginObject)
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
