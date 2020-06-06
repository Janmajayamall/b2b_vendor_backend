const { verifyJwt } = require("./../../utils/index")

module.exports = {
    Mutation: {
        async createItemOrders(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            // authenticate the buyer
            const buyerId = await verifyJwt(reqHeaders.authorization)
            console.log(buyerId)
            //TODO: validate the input
            const createOrdersInput = args.userInput

            //creating orders for all the items
            const result = await queries.mongoDbQueries.createItemOrders(dbs, queries, createOrdersInput, buyerId)
            return result
        },

        async closeItemOrder(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            // authenticate the buyer
            const buyerId = await verifyJwt(reqHeaders.authorization)

            // extract order id
            const { orderId } = args

            const result = await queries.mongoDbQueries.closeItemOrder(dbs, orderId)
            return result
        }
    },
    Query: {
        async buyerGetActiveItemOrders(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            // authenticate the buyer
            const buyerId = await verifyJwt(reqHeaders.authorization)

            //getting active itemOrders
            const result = await queries.mongoDbQueries.buyerGetActiveItemOrders(dbs, buyerId)
            return result
        },

        async buyerGetItemDetails(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            // authenticate the buyer
            const buyerId = await verifyJwt(reqHeaders.authorization)

            //get orderId
            const orderId = args.orderId

            //getting buyer item order details
            const result = await queries.mongoDbQueries.buyerGetItemDetails(dbs, orderId)

            return result
        },

        async buyerSearchOrders(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            // authenticate the buyer
            const buyerId = await verifyJwt(reqHeaders.authorization)

            // get search query
            const { userInput } = args

            // search orders
            const result = await queries.mongoDbQueries.buyerSearchOrders(dbs, buyerId, userInput)
            return result
        }
    }
}
