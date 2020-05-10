const { verifyJwt } = require("./../../utils/index")

module.exports = {
    Mutation: {
        async registerBuyer(parent, args, context) {
            //extracting contexts
            const { clients, queries, reqHeaders } = context

            //authenticate the admin user of the company
            const companyId = await verifyJwt(reqHeaders.authorization)

            //TODO: validate the input
            const registerObject = args.userInput

            const result = await queries.dynamodbQueries.registerBuyer(clients, queries, registerObject, companyId)
            return result
        },

        async loginBuyer(parent, args, context) {
            //extracting contexts
            const { clients, queries, reqHeaders } = context

            const loginObject = args.userInput

            const result = await queries.dynamodbQueries.loginBuyer(clients, queries, loginObject)
            return result
        }
    }
}
