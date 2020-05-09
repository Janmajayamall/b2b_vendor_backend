const { v4: uuidv4 } = require("uuid")
const tableSchemas = require("./../../tableSchemas")

async function createItemOrders(clients, queries, createOrdersInput, userId) {
    //declaring groupId for this group of items
    const buyerGroupId = uuidv4()

    //generating batch item input for item orders
    const batchItemOrdersWriteOperations = []

    createOrdersInput.items.forEach((element) => {
        //adding the parameters by looping through object keys
        let productParameters = JSON.parse(element.productParameters)
        let productParametersOps = {}
        Object.keys(productParameters).forEach((param) => {
            let tempParam = {
                S: productParameters[param]
            }
            productParametersOps[param] = tempParam
        })

        let operation = {
            PutRequest: {
                Item: {
                    id: {
                        S: uuidv4()
                    },
                    buyerId: {
                        S: userId
                    },
                    buyerRfqId: {
                        S: element.buyerRfqId
                    },
                    buyerPrId: {
                        S: element.buyerPrId
                    },
                    buyerItemId: {
                        S: element.buyerItemId
                    },
                    productName: {
                        S: element.productName
                    },
                    productDescription: {
                        S: element.productDescription
                    },
                    quantity: {
                        N: element.quantity
                    },
                    unit: {
                        S: element.unit
                    },
                    termsAndConditions: {
                        S: element.termsAndConditions
                    },
                    productParameters: {
                        M: productParametersOps
                    },
                    deliveryDays: {
                        N: element.deliveryDays
                    },
                    buyerGroupId: {
                        S: buyerGroupId
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
                }
            }
        }
        batchItemOrdersWriteOperations.push(operation)
    })

    //preparing batchWrites
    const batchWritesReq = {
        RequestItems: {}
    }
    //operations for itemOrders table
    batchWritesReq["RequestItems"][tableSchemas.itemOrders.tableName] = batchItemOrdersWriteOperations

    //carrying out the batch write operations
    const result = await clients.dynamodbClient.batchWriteItem(batchWritesReq).promise()

    //finding vendors for the items orders
    const esRes = await queries.esQueries.getMatchedVendors(clients.esClient, {
        categories: createOrdersInput.categories,
        products: createOrdersInput.products
    })

    //TODO: remove filteration --> replace it by es projection in the query itself
    const vendorIds = []
    esRes.hits.hits.forEach((hit) => {
        vendorIds.push(hit._source.vendorId)
    })
    console.log(esRes.hits.hits, vendorIds)
    //bulk generate vendor orders, don't await it
    queries.dynamodbQueries.bulkCreateVendorOrders(clients, batchItemOrdersWriteOperations, vendorIds)

    return true
}

module.exports = {
    createItemOrders
}
