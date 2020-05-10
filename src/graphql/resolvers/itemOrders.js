const { verifyJwt } = require("./../../utils/index")

module.exports = {
    Mutation: {
        async createItemOrders(parent, args, context) {
            //extracting contexts
            const { clients, queries, reqHeaders } = context

            //authenticate the buyer
            const buyerId = await verifyJwt(reqHeaders.authorization)

            //TODO: validate the input
            const createOrdersInput = args.userInput

            //creating orders for all the items
            const result = await queries.dynamodbQueries.createItemOrders(clients, queries, createOrdersInput, buyerId)
            return result
        }
    }
}
