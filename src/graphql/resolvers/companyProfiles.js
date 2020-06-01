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
    },
    Queries: {
        async searchCompanyProfiles(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            //authenticate request
            const companyId = await verifyJwt(reqHeaders.authorization)

            //get user input
            const { userInput } = args

            const result = await queries.mongoDbQueries.searchCompanyProfiles(dbs, companyId, userInput)
            return result
        },
        async companyGetVendorCompanyProfile(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            //authenticate request
            const companyId = await verifyJwt(reqHeaders.authorization)

            //get user input
            const { vendorCompanyId } = args

            const result = await queries.mongoDbQueries.companyGetVendorCompanyProfile(dbs, companyId, vendorCompanyId)
            return result
        }
    }
}
