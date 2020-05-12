const { v4: uuidv4 } = require("uuid")
const tableSchemas = require("./../../tableSchemas")

async function bulkCreateVendorOrders(clients, itemOrdersReq, vendorIdsList) {
    //lopping through each vendor & placing order for each ONE BY ONE
    for (let index = 0; index < vendorIdsList.length; index++) {
        const vendorOrdersBatchOperations = []

        itemOrdersReq.forEach((req) => {
            let operationItem = {
                ...req.PutRequest.Item
            }

            //adding orderId & vendorId
            operationItem.orderId = operationItem.id
            operationItem.vendorId = vendorIdsList[index]

            //deleting old id, buyerRfqId, buyerPrId, buyerItemId, buyerGroupId
            delete operationItem.id
            delete operationItem.buyerRfqId
            delete operationItem.buyerPrId
            delete operationItem.buyerItemId
            delete operationItem.buyerGroupId

            //adding vendor quote fields
            operationItem.quotedProductName = operationItem.productName
            operationItem.quotedProductDescription = operationItem.productDescription
            operationItem.quotedProductDescription = operationItem.productDescription
            operationItem.quotedProductParameters = operationItem.productParameters
            operationItem.quotedPricePerUnit = 0.0
            operationItem.quotedQuantity = operationItem.quantity
            operationItem.quotedUnit = operationItem.unit
            operationItem.quotedDiscount = 0.0
            operationItem.quotedDeliveryCost = 0.0
            operationItem.quotedLandingPrice = 0.0
            operationItem.quotedValidity = 0.0
            operationItem.quotedDeliveryDays = 0.0
            operationItem.status = "WAITING"

            //adding to vendorOrdersBatchOperations
            vendorOrdersBatchOperations.push({
                PutRequest: {
                    Item: operationItem
                }
            })
        })

        //batch write operation request
        const batchWriteReq = {
            RequestItems: {}
        }
        //assigning table to write operations
        batchWriteReq["RequestItems"][tableSchemas.vendorOrders.tableName] = vendorOrdersBatchOperations

        //carrying on batch write operation for orders received by the vendor
        await clients.dynamodbClient.batchWrite(batchWriteReq).promise()
    }
    return true
}

async function getVendorOrders(clients, vendorId) {
    const result = await clients.dynamodbClient.get({
        TableName: tableSchemas.vendorOrders.tableName,
        Key: {
            vendorId: vendorId
        }
    })
}

module.exports = {
    bulkCreateVendorOrders
}
