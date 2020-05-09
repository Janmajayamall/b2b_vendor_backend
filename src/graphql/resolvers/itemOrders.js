module.exports = {
    Mutation: {
        async createItemOrders(parent, args, context) {
            //extracting contexts
            const { clients, queries, reqHeaders } = context

            //TODO: validate the input
            const createOrdersInput = args.userInput

            //creating orders for all the items
            const result = await queries.dynamodbQueries.createItemOrders(
                clients,
                queries,
                createOrdersInput,
                "this-is-test"
            )
            return result
        }
    }
}
