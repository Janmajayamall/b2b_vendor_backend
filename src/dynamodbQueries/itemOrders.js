const { v4: uuidv4 } = require("uuid")
const tableSchemas = require("./../../tableSchemas")

async function createItemOrders(clients, queries, createOrdersInput, buyerId) {
    //declaring groupId for this group of items
    const buyerGroupId = uuidv4()

    //generating batch item input for item orders
    const batchItemOrdersWriteOperations = []

    createOrdersInput.items.forEach((element) => {
        let operation = {
            PutRequest: {
                Item: {
                    id: uuidv4(),
                    buyerId: buyerId,
                    buyerRfqId: element.buyerRfqId.trim(),
                    buyerPrId: element.buyerPrId.trim(),
                    buyerItemId: element.buyerItemId.trim(),
                    productName: element.productName.trim(),
                    productDescription: element.productDescription.trim(),
                    quantity: element.quantity,
                    unit: element.unit.trim(),
                    termsAndConditions: element.termsAndConditions.trim(),
                    productParameters: JSON.parse(element.productParameters),
                    deliveryDays: element.deliveryDays,
                    buyerGroupId: buyerGroupId,
                    createdAt: new Date().getTime(),
                    lastModified: new Date().getTime(),
                    status: "ACTIVE"
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
    const result = await clients.dynamodbClient.batchWrite(batchWritesReq).promise()

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
