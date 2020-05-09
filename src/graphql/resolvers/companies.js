module.exports = {
    Mutation: {
        async registerCompany(parent, args, context) {
            //extracting contexts
            const { clients, queries, reqHeaders } = context

            //TODO: validate the input
            const registerObject = args.userInput

            const result = await queries.dynamodbQueries.registerCompany(clients, registerObject)
            return result
        },

        async loginCompany(parent, args, context) {
            //extracting contexts
            const { clients, queries, reqHeaders } = context

            //TODO: validate the input
            const loginObject = args.userInput

            const result = await queries.dynamodbQueries.loginCompany(clients, queries, loginObject)
            return result
        }
    }
}
