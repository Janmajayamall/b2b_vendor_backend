const { verifyJwt } = require("./../../utils/index")

module.exports = {
    Mutation: {
        async addCategoryProducts(parent, args, context) {
            //extracting contexts
            const { clients, queries, reqHeaders } = context

            //authenticate the user
            const vendorId = await verifyJwt(reqHeaders.authorization)

            //TODO: validate the input
            const addObjectArr = args.userInput

            const result = await queries.dynamodbQueries.addCategoryProducts(clients, addObjectArr, vendorId)
            return result
        }
    }
}
