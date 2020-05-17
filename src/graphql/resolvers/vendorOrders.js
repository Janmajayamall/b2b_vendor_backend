const { verifyJwt } = require("./../../utils/index")

module.exports = {
    Mutation: {
        async rejectItemOrder(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            // authenticate the buyer
            const vendorId = await verifyJwt(reqHeaders.authorization)

            // getting order id
            const orderId = args.orderId

            //reject the item Order
            const result = await queries.mongoDbQueries.rejectItemOrder(dbs, vendorId, orderId)
            return result
        },

        async updateVendorOrderDetails(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            // authenticate the buyer
            const vendorId = await verifyJwt(reqHeaders.authorization)

            // getting order id & user input
            const { orderId, userInput } = args

            const result = await queries.mongoDbQueries.updateVendorOrderDetails(dbs, vendorId, orderId, userInput)
            return result
        }
    },
    Query: {
        async getIncomingVendorOrders(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            // authenticate the buyer
            const vendorId = await verifyJwt(reqHeaders.authorization)

            //creating orders for all the items
            const result = await queries.mongoDbQueries.getIncomingVendorOrders(dbs, vendorId)
            return result
        },

        async getItemOrderDetails(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            // authenticate the buyer
            const vendorId = await verifyJwt(reqHeaders.authorization)

            // getting order id
            const orderId = args.orderId

            const result = await queries.mongoDbQueries.getItemOrderDetails(dbs, vendorId, orderId)
            return result
        }
    }
}
