module.exports = {
    Mutation: {
        async registerCompany(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            //TODO: validate the input
            const registerObject = args.userInput

            const result = await queries.mongoDbQueries.registerCompany(dbs, registerObject)
            return result
        },

        async loginCompany(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            //TODO: validate the input
            const loginObject = args.userInput

            const result = await queries.mongoDbQueries.loginCompany(dbs, queries, loginObject)
            return result
        }
    }
}
