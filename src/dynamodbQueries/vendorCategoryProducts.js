const { v4: uuidv4 } = require("uuid")
const tableSchemas = require("./../../tableSchemas")

async function addCategoryProducts(clients, addObjectArr, vendorId) {
    /*
        creating items along with put request to db
        Note: Not using batchWrite here because it does not allows
        conditional expression to check whether category & vendor combination
        exists or not.
        TODO: Make sure that no more than 20 categories can be added at once; otherwise 
        it will occupy a lot of time
    */
    for (let i = 0; i < addObjectArr.length; i++) {
        const req = {
            TableName: tableSchemas.vendorCategoryProducts.tableName,
            Item: {
                vendorId: vendorId,
                productsCategory: addObjectArr[i].productsCategory.trim(),
                products: addObjectArr[i].products,
                createdAt: new Date().getTime(),
                lastModified: new Date().getTime(),
                status: "ACTIVE"
            },
            ConditionExpression: "attribute_not_exists(vendorId) AND attribute_not_exists(productsCategory)"
        }

        //making the request to dynamo
        try {
            const result = await clients.dynamodbClient.put(req).promise()
        } catch (e) {
            //TODO: comment this console out, as it is for internal stuff
            console.log(e)
        }
    }

    return true
}

module.exports = {
    addCategoryProducts
}
