module.exports = {
    Mutation: {
        async createVendorProfile(parent, args, context) {
            //extracting contexts
            const { clients, queries, reqHeaders } = context

            //TODO: validate the input
            const registerObject = args.userInput

            const result = await queries.dynamodbQueries.createVendorProfile(clients, registerObject)
            return result
        }
    }
}
