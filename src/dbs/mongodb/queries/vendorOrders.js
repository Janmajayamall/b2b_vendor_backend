const { ObjectID, Double } = require("mongodb")
const { constants } = require("./../../../utils/index")

async function bulkCreateVendorOrders(dbs, itemOrdersOps, vendorsList) {
    //creating set of vendor ids --> in order to unique vendor ids
    const vendorsSet = new Set()
    vendorsList.forEach((vendor) => {
        vendorsSet.add(vendor.vendorId)
    })

    //converting set to array
    const vendorIds = []
    vendorsSet.forEach((value) => {
        vendorIds.push(value)
    })
    console.log(vendorIds, "bulkCreateVendorOrders vendorIds")
    //looping through each vendor & placing order to each vendor ONE by ONE
    for (let index = 0; index < vendorIds.length; index++) {
        //getting vendorProfile
        const vendorProfile = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorProfiles).findOne({
            vendorId: ObjectID(vendorIds[index])
        })
        if (!vendorProfile) {
            continue
        }

        //getting companyProfile
        const companyProfile = await dbs.mainDb.client.collection(dbs.mainDb.collections.companyProfiles).findOne({
            companyId: ObjectID(vendorProfile.companyId)
        })
        if (!companyProfile) {
            continue
        }

        const insertManyVendorOrders = []
        itemOrdersOps.forEach((order) => {
            let vendorOperation = {
                ...order
            }

            //adding orderId & vendorId
            vendorOperation.orderId = ObjectID(order._id)
            vendorOperation.vendorId = ObjectID(vendorIds[index])

            //deleting old _id, buyerRfqId, buyerPrId, buyerItemId, buyerGroupId
            delete vendorOperation._id
            delete vendorOperation.buyerRfqId
            delete vendorOperation.buyerPrId
            delete vendorOperation.buyerItemId
            delete vendorOperation.buyerGroupId
            delete vendorOperation.createdAt
            delete vendorOperation.lastModified
            delete vendorOperation.status

            //adding vendor quote fields
            vendorOperation.quotedProductName = order.productName
            vendorOperation.quotedProductDescription = order.productDescription
            vendorOperation.quotedProductParameters = order.productParameters
            vendorOperation.quotedPricePerUnit = Double(0.0)
            vendorOperation.quotedQuantityPrice = Double(0.0)
            vendorOperation.quotedQuantity = order.quantity
            vendorOperation.quotedUnit = order.unit
            vendorOperation.quotedDiscount = Double(0.0)
            vendorOperation.quotedDeliveryCost = Double(0.0)
            vendorOperation.quotedLandingPrice = Double(0.0)
            vendorOperation.quotedPriceCurrency = ""
            vendorOperation.quotedValidity = Double(0.0)
            vendorOperation.quotedDeliveryDays = order.deliveryDays
            vendorOperation.quotedTermsAndConditions = ""
            vendorOperation.status = "WAITING"
            vendorOperation.vendorName = vendorProfile.name
            //adding vendor & company profile details
            vendorOperation.vendorCompanyName = companyProfile.name
            vendorOperation.vendorCompanyId = ObjectID(companyProfile.companyId)
            vendorOperation.vendorCompanyCity = companyProfile.city
            vendorOperation.vendorCompanyState = companyProfile.state
            vendorOperation.vendorCompanyLocationCoordinates = companyProfile.locationCoordinates

            vendorOperation.createdAt = new Date()
            vendorOperation.lastModified = new Date()

            insertManyVendorOrders.push(vendorOperation)
        })

        //place order for items to the vendor
        const result = await dbs.mainDb.client
            .collection(dbs.mainDb.collections.vendorOrders)
            .insertMany(insertManyVendorOrders)
    }
}

async function getIncomingVendorOrders(dbs, vendorId) {
    const result = await dbs.mainDb.client
        .collection(dbs.mainDb.collections.vendorOrders)
        .find({
            vendorId: ObjectID(vendorId),
            status: "WAITING"
        })
        .sort({
            createdAt: -1
        })
        .toArray()

    return result
}

async function getItemOrderDetails(dbs, vendorId, orderId) {
    let result = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorOrders).findOne({
        vendorId: ObjectID(vendorId),
        orderId: ObjectID(orderId)
    })
    console.log(result)
    if (!result) {
        return {
            error: constants.errorCodes.recordNotFound
        }
    }

    //stringify the parameters
    result.productParameters = JSON.stringify(result.productParameters)
    result.quotedProductParameters = JSON.stringify(result.quotedProductParameters)

    return {
        error: constants.errorCodes.noError,
        itemOrder: result
    }
}

async function rejectItemOrder(dbs, vendorId, orderId) {
    console.log(vendorId, orderId)
    let result = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorOrders).findOneAndUpdate(
        {
            vendorId: ObjectID(vendorId),
            orderId: ObjectID(orderId)
        },
        {
            $set: { status: "CANCELLED" }
        },
        { returnNewDocument: true }
    )
    console.log(result)
    return true
}

async function updateVendorOrderDetails(dbs, vendorId, orderId, userInput) {
    //format the userInput
    let updateObject = {
        ...userInput
    }

    if (updateObject.quotedPricePerUnit !== undefined) {
        updateObject.quotedPricePerUnit = Double(updateObject.quotedPricePerUnit)
    }
    if (updateObject.quotedQuantityPrice !== undefined) {
        updateObject.quotedQuantityPrice = Double(updateObject.quotedQuantityPrice)
    }
    if (updateObject.quotedQuantity !== undefined) {
        updateObject.quotedQuantity = Double(updateObject.quotedQuantity)
    }
    if (updateObject.quotedDiscount !== undefined) {
        updateObject.quotedDiscount = Double(updateObject.quotedDiscount)
    }
    if (updateObject.quotedDeliveryCost !== undefined) {
        updateObject.quotedDeliveryCost = Double(updateObject.quotedDeliveryCost)
    }
    if (updateObject.quotedLandingPrice !== undefined) {
        updateObject.quotedLandingPrice = Double(updateObject.quotedLandingPrice)
    }
    if (updateObject.quotedValidity !== undefined) {
        updateObject.quotedValidity = Double(updateObject.quotedValidity)
    }
    if (updateObject.quotedProductParameters !== undefined) {
        updateObject.quotedProductParameters = JSON.parse(updateObject.quotedProductParameters)
    }

    //updating vendor order
    const result = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorOrders).findOneAndUpdate(
        {
            vendorId: ObjectID(vendorId),
            orderId: ObjectID(orderId)
        },
        {
            $set: { ...updateObject, status: "QUOTED" }
        },
        {
            returnNewDocument: true
        }
    )

    return {
        error: constants.errorCodes.noError
    }
}

module.exports = {
    bulkCreateVendorOrders,
    getIncomingVendorOrders,
    getItemOrderDetails,
    rejectItemOrder,
    updateVendorOrderDetails
}
