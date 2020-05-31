const { verifyJwt } = require("./../../utils/index")

module.exports = {
    Mutation: {
        async addPreferredVendor(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            //authenticate company
            const companyId = await verifyJwt(reqHeaders.authorization)

            //get vendorCompanyId
            const { vendorCompanyId } = args

            const result = await queries.mongoDbQueries.addPreferredVendor(dbs, companyId, vendorCompanyId)
            return result
        },
        async removePreferredVendor(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            //authenticate company
            const companyId = await verifyJwt(reqHeaders.authorization)

            //get vendorCompanyId
            const { vendorCompanyId } = args

            const result = await queries.mongoDbQueries.removePreferredVendor(dbs, companyId, vendorCompanyId)
            return result
        }
    },
    Query: {
        async companyGetPreferredVendors(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            //authenticate company
            const companyId = await verifyJwt(reqHeaders.authorization)

            const result = await queries.mongoDbQueries.companyGetPreferredVendors(dbs, companyId)
            return result
        },
        async buyerGetPreferredVendors(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            //authenticate buyer
            const buyerId = await verifyJwt(reqHeaders.authorization)

            const result = await queries.mongoDbQueries.buyerGetPreferredVendors(dbs, buyerId)
            return result
        },
        async companyCheckPreferredVendor(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            //authenticate company
            const companyId = await verifyJwt(reqHeaders.authorization)

            //get vendorCompanyId
            const { vendorCompanyId } = args

            const result = await queries.mongoDbQueries.companyCheckPreferredVendor(dbs, companyId, vendorCompanyId)
            return result
        }
    }
}
