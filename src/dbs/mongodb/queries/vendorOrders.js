const { ObjectID, Double } = require("mongodb")
const { constants } = require("./../../../utils/index")

async function bulkCreateVendorOrders(dbs, itemOrdersOps, vendorsList) {
    //creating set of vendor ids --> in order to unique vendor ids
    const vendorsSet = new Set()
    vendorsList.forEach((vendor) => {
        vendorsSet.add(vendor)
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
            vendorOperation.quotedProductFile = ""
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

async function getItemOrderQuotations(dbs, orderId, filters) {
    /**
     * Generating filter query for quotations
     * Note that you can city, country, and state are mutually exclusive filters.
     * Also, if preferredVendors is set to true then other filters don't apply.
     */
    console.log(filters, orderId)
    let filterObject = {
        orderId: ObjectID(orderId),
        status: { $in: ["QUOTED", "REJECTED"] }
    }
    let sortObject = {
        quotedLandingPrice: 1
    }
    //preferredVendors set to true
    if (filters.preferredVendors != undefined && filters.preferredVendors === true) {
        //TODO: get the vendorIds of preferredVendors & set the filter
    } else if (filters.city != undefined && filters.city.trim() !== "") {
        filterObject.city = filters.city.trim()
    } else if (filters.state != undefined && filters.state.trim() !== "") {
        filterObject.state = filters.state.trim()
    } else if (filters.country != undefined && filters.country.trim() !== "") {
        filterObject.country = filters.country.trim()
    } else if (filters.sort != undefined) {
        //checking sort type
        if (filters.sort.nearest != undefined && filters.sort.nearest === true) {
            sortObject = {
                ...sortObject
            }
        }
    }

    //getting item order quotations
    const result = await dbs.mainDb.client
        .collection(dbs.mainDb.collections.vendorOrders)
        .find(filterObject)
        .sort(sortObject)
        .toArray()

    const formattedResult = []
    result.forEach((object) => {
        formattedResult.push({
            ...object,
            productParameters: JSON.stringify(object.productParameters),
            quotedProductParameters: JSON.stringify(object.quotedProductParameters)
        })
    })
    return formattedResult
}

async function getQuotationDetails(dbs, quotationId) {
    //getting item order quotations
    const result = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorOrders).findOne({
        _id: ObjectID(quotationId)
    })

    const formattedResponse = {
        ...result,
        productParameters: JSON.stringify(result.productParameters),
        quotedProductParameters: JSON.stringify(result.quotedProductParameters)
    }
    return formattedResponse
}

async function buyerMarkUnderReviewQuotation(dbs, quotationId) {
    console.log(quotationId)
    let result = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorOrders).findOneAndUpdate(
        {
            _id: ObjectID(quotationId)
        },
        {
            $set: { status: "REVIEW" }
        },
        { returnNewDocument: true }
    )

    return {
        error: constants.errorCodes.noError
    }
}

async function buyerUnmarkUnderReviewQuotation(dbs, quotationId) {
    let result = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorOrders).findOneAndUpdate(
        {
            _id: ObjectID(quotationId)
        },
        {
            $set: { status: "QUOTED" }
        },
        { returnNewDocument: true }
    )
    return {
        error: constants.errorCodes.noError
    }
}

async function buyerFinalizeQuotation(dbs, quotationId, orderId) {
    console.log(quotationId, orderId)
    /**
     * Necessary check before proceeding with finalizing quotation
     * for Item Order
     * 1. Check Item Order is not NOT_ACTIVE
     * 2. Check No Quotation with order
     */
    let checkItemOrder = await dbs.mainDb.client.collection(dbs.mainDb.collections.itemOrders).findOne({
        _id: ObjectID(orderId)
    })
    if (checkItemOrder == undefined || checkItemOrder.status == undefined) {
        return {
            error: constants.errorCodes.orderItemDoesNotExists
        }
    }
    if (checkItemOrder.status === "NOT_ACTIVE") {
        return {
            error: constants.errorCodes.orderItemClosed
        }
    }

    let checkFinalizedQuote = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorOrders).findOne({
        orderId: ObjectID(orderId),
        status: "ACCEPTED"
    })
    if (checkFinalizedQuote != undefined) {
        return {
            error: constants.errorCodes.finalizedQuotationExists
        }
    }

    /**
     * 1. Change status of quotations that are not CANCELLED & not with _id === quotationId
     *    to status=REJECTED
     * 2. Change the quotation with _id=quotationId to ACCEPTED
     * 3. Close the Item Order
     */

    //step 1
    let resOne = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorOrders).updateMany(
        {
            _id: { $ne: ObjectID(quotationId) },
            status: { $nin: ["CANCELLED"] },
            orderId: { $eq: ObjectID(orderId) }
        },
        {
            $set: { status: "REJECTED" }
        }
    )

    //step 2
    let resTwo = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorOrders).findOneAndUpdate(
        {
            _id: ObjectID(quotationId)
        },
        {
            $set: { status: "ACCEPTED" }
        },
        { returnNewDocument: true }
    )

    //step 3
    let resItemOrder = await dbs.mainDb.client.collection(dbs.mainDb.collections.itemOrders).findOneAndUpdate(
        {
            _id: ObjectID(orderId)
        },
        {
            $set: { status: "NOT_ACTIVE" }
        }
    )

    return {
        error: constants.errorCodes.noError
    }
}

async function getItemOrderQuotationsUnderReview(dbs, orderId) {
    //getting item order quotations where status is REVIEW
    const result = await dbs.mainDb.client
        .collection(dbs.mainDb.collections.vendorOrders)
        .find({
            orderId: ObjectID(orderId),
            status: "REVIEW"
        })
        .sort({
            quotedLandingPrice: 1
        })
        .toArray()

    const formattedResult = []
    result.forEach((object) => {
        formattedResult.push({
            ...object,
            productParameters: JSON.stringify(object.productParameters),
            quotedProductParameters: JSON.stringify(object.quotedProductParameters)
        })
    })
    return formattedResult
}

async function getItemOrderAcceptedQuotation(dbs, orderId) {
    //getting item order quotations where status is REVIEW
    const result = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorOrders).findOne({
        orderId: ObjectID(orderId),
        status: "ACCEPTED"
    })

    if (result == undefined) {
        return
    }

    const formattedResult = {
        ...result,
        productParameters: JSON.stringify(result.productParameters),
        quotedProductParameters: JSON.stringify(result.quotedProductParameters)
    }

    return formattedResult
}

module.exports = {
    bulkCreateVendorOrders,
    getIncomingVendorOrders,
    getItemOrderDetails,
    rejectItemOrder,
    updateVendorOrderDetails,
    getItemOrderQuotations,
    getQuotationDetails,
    buyerMarkUnderReviewQuotation,
    buyerUnmarkUnderReviewQuotation,
    buyerFinalizeQuotation,
    getItemOrderQuotationsUnderReview,
    getItemOrderAcceptedQuotation
}
