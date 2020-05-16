const { verifyJwt } = require("./../../utils/index")

module.exports = {
    Mutation: {
        async createCompanyProfile(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            //authenticate request
            const companyId = await verifyJwt(reqHeaders.authorization)

            //TODO: validate the input
            const registerObject = args.userInput

            const result = await queries.mongoDbQueries.createCompanyProfile(dbs, registerObject, companyId)
            return result
        }
    }
}
