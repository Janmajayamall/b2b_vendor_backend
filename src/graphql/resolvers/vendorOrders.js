const { verifyJwt } = require("./../../utils/index")

module.exports = {
    Mutation: {
        async rejectItemOrder(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            // authenticate the vendor
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

            // authenticate the vendor
            const vendorId = await verifyJwt(reqHeaders.authorization)

            // getting order id & user input
            const { orderId, userInput } = args

            const result = await queries.mongoDbQueries.updateVendorOrderDetails(dbs, vendorId, orderId, userInput)
            return result
        },

        async buyerMarkUnderReviewQuotation(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            // authenticate the buyer
            await verifyJwt(reqHeaders.authorization)

            //getting quotationId
            const { quotationId } = args

            const result = await queries.mongoDbQueries.buyerMarkUnderReviewQuotation(dbs, quotationId)
            return result
        },

        async buyerUnmarkUnderReviewQuotation(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            // authenticate the buyer
            await verifyJwt(reqHeaders.authorization)

            //getting quotationId
            const { quotationId } = args

            const result = await queries.mongoDbQueries.buyerUnmarkUnderReviewQuotation(dbs, quotationId)
            return result
        },

        async buyerFinalizeQuotation(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            // authenticate the buyer
            await verifyJwt(reqHeaders.authorization)

            //getting quotationId
            const { quotationId } = args

            const result = await queries.mongoDbQueries.buyerFinalizeQuotation(dbs, quotationId)
            return result
        }
    },
    Query: {
        async getIncomingVendorOrders(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            // authenticate the vendor
            const vendorId = await verifyJwt(reqHeaders.authorization)

            //creating orders for all the items
            const result = await queries.mongoDbQueries.getIncomingVendorOrders(dbs, vendorId)
            return result
        },

        async getItemOrderDetails(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            // authenticate the vendor
            const vendorId = await verifyJwt(reqHeaders.authorization)

            // getting order id
            const orderId = args.orderId

            const result = await queries.mongoDbQueries.getItemOrderDetails(dbs, vendorId, orderId)
            return result
        },

        async getItemOrderQuotations(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            // authenticate the buyer
            await verifyJwt(reqHeaders.authorization)

            //getting order id
            const { orderId, quotationFilters } = args.userInput

            const result = await queries.mongoDbQueries.getItemOrderQuotations(dbs, orderId, quotationFilters)
            return result
        },

        async getQuotationDetails(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            // authenticate
            await verifyJwt(reqHeaders.authorization)

            //getting quotation id
            const { quotationId } = args

            const result = await queries.mongoDbQueries.getQuotationDetails(dbs, quotationId)
            return result
        }
    }
}
