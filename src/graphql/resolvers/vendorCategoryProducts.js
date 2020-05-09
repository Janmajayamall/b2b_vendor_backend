module.exports = {
    Mutation: {
        async addCategoryProducts(parent, args, context) {
            //extracting contexts
            const { clients, queries, reqHeaders } = context

            //TODO: validate the input
            const addObject = args.userInput

            const result = await queries.dynamodbQueries.addCategoryProducts(clients, addObject)
            return result
        }
    }
}
