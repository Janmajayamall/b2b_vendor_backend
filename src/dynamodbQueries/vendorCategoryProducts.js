const { v4: uuidv4 } = require("uuid")
const tableSchemas = require("./../../tableSchemas")

async function addCategoryProducts(clients, addObject) {
    //creating item
    const item = {
        TableName: tableSchemas.vendorCategoryProducts.tableName,
        Item: {
            vendorId: {
                S: addObject.vendorId
            },
            productsCategory: {
                S: addObject.productsCategory
            },
            products: {
                SS: addObject.products
            },
            createdAt: {
                N: String(new Date().getTime())
            },
            lastModified: {
                N: String(new Date().getTime())
            },
            status: {
                S: "ACTIVE"
            }
        },
        ConditionExpression: "attribute_not_exists(vendorId) AND attribute_not_exists(productsCategory)"
    }

    //creating the item
    try {
        const result = await clients.dynamodbClient.putItem(item).promise()
        return true
    } catch (e) {
        console.log("error in addCategoryProducts() resolvers: ", e)
        return false
    }
}

module.exports = {
    addCategoryProducts
}
