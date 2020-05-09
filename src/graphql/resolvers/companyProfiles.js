const { verifyJwt } = require("./../../utils/index")

module.exports = {
    Mutation: {
        async createCompanyProfile(parent, args, context) {
            //extracting contexts
            const { clients, queries, reqHeaders } = context

            //authenticate request
            const companyId = await verifyJwt(reqHeaders.authorization)

            //TODO: validate the input
            const registerObject = args.userInput

            const result = await queries.dynamodbQueries.createCompanyProfile(clients, registerObject, companyId)
            return result
        }
    }
}
