const { verifyJwt } = require("./../../utils/index")

module.exports = {
    Mutation: {},
    Query: {
        async getIncomingVendorOrders(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            // authenticate the buyer
            const vendorId = await verifyJwt(reqHeaders.authorization)

            //creating orders for all the items
            const result = await queries.mongoDbQueries.getIncomingVendorOrders(dbs, vendorId)
            return result
        }
    }
}
