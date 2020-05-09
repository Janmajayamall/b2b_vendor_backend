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
            operationItem.orderId = {
                ...operationItem.id
            }
            operationItem.vendorId = {
                S: vendorIdsList[index].S
            }

            //deleting old id, buyerRfqId, buyerPrId, buyerItemId, buyerGroupId
            delete operationItem.id
            delete operationItem.buyerRfqId
            delete operationItem.buyerPrId
            delete operationItem.buyerItemId
            delete operationItem.buyerGroupId

            //adding vendor quote fields
            operationItem.quotedProductName = {
                ...operationItem.productName
            }
            operationItem.quotedProductDescription = {
                ...operationItem.productDescription
            }
            operationItem.quotedProductDescription = {
                ...operationItem.productDescription
            }
            operationItem.quotedProductParameters = {
                ...operationItem.productParameters
            }
            operationItem.quotedPricePerUnit = {
                N: "0.0"
            }
            operationItem.quotedQuantity = {
                ...operationItem.quantity
            }
            operationItem.quotedUnit = {
                ...operationItem.unit
            }
            operationItem.quotedDiscount = {
                N: "0.0"
            }
            operationIttem.quotedDeliveryCost = {
                N: "0.0"
            }
            operationItem.quotedLandingPrice = {
                N: "0.0"
            }
            operationItem.quotedValidity = {
                N: "0"
            }
            operationItem.quotedDeliveryDays = {
                ...operationItem.deliveryDays
            }
            operationItem.status = {
                S: "WAITING"
            }

            console.log(operationItem)
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
        await clients.dynamodbClient.batchWriteItem(batchWriteReq).promise()
    }
    return true
}

module.exports = {
    bulkCreateVendorOrders
}
