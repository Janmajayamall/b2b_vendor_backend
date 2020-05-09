module.exports = {
    Mutation: {
        async registerBuyer(parent, args, context) {
            //extracting contexts
            const { clients, queries, reqHeaders } = context

            //TODO: validate the input
            const registerObject = args.userInput

            const result = await queries.dynamodbQueries.registerBuyer(clients, registerObject)
            return result
        }
    }
}
