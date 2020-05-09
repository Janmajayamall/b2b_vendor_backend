module.exports = {
    Mutation: {
        async createBuyerProfile(parent, args, context) {
            //extracting contexts
            const { clients, queries, reqHeaders } = context

            //TODO: validate the input
            const registerObject = args.userInput

            const result = await queries.dynamodbQueries.createBuyerProfile(clients, registerObject)
            return result
        }
    }
}
