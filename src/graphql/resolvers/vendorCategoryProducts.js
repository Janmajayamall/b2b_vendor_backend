const { verifyJwt } = require("./../../utils/index")

module.exports = {
    Mutation: {
        async addCategoryProducts(parent, args, context) {
            //extracting contexts
            const { dbs, queries, reqHeaders } = context

            //authenticate the user
            const vendorId = await verifyJwt(reqHeaders.authorization)

            //TODO: validate the input
            const addObjectArr = args.userInput

            const result = await queries.mongoDbQueries.addCategoryProducts(dbs, queries, addObjectArr, vendorId)
            return result
        }
    }
}
