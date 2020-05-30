const { ObjectID, Double } = require("mongodb")
const { v4: uuidv4 } = require("uuid")
const {} = require("./../../../utils/index")

async function createItemOrders(dbs, queries, createOrdersInput, buyerId) {
    // get buyer's details
    const buyerProfileObject = await dbs.mainDb.client.collection(dbs.mainDb.collections.buyerProfiles).findOne({
        buyerId: ObjectID(buyerId)
    })

    if (!buyerProfileObject) {
        return false
    }

    //get buyer's company details
    const companyProfileObject = await dbs.mainDb.client.collection(dbs.mainDb.collections.companyProfiles).findOne({
        companyId: ObjectID(buyerProfileObject.companyId)
    })
    if (!companyProfileObject) {
        return false
    }
    console.log(buyerId, buyerProfileObject, companyProfileObject)
    const buyerGroupId = uuidv4()

    //generating insert many operations for item Orders
    const insertManyOps = []

    createOrdersInput.items.forEach((element) => {
        insertManyOps.push({
            buyerId: ObjectID(buyerId),
            buyerName: buyerProfileObject.name,
            buyerRfqId: element.buyerRfqId.trim(),
            buyerPrId: element.buyerPrId.trim(),
            buyerItemId: element.buyerItemId.trim(),
            productName: element.productName.trim(),
            productDescription: element.productDescription.trim(),
            quantity: Double(element.quantity),
            unit: element.unit.trim(),
            termsAndConditions: element.termsAndConditions.trim(),
            productParameters: JSON.parse(element.productParameters),
            deliveryDays: element.deliveryDays.trim(),
            buyerGroupId: buyerGroupId,
            companyId: ObjectID(buyerProfileObject.companyId),
            companyName: companyProfileObject.name,
            companyCity: companyProfileObject.city,
            companyState: companyProfileObject.state,
            companyLocationCoordinates: companyProfileObject.locationCoordinates,
            companyCountry: companyProfileObject.country,
            createdAt: new Date(),
            lastModified: new Date(),
            status: "ACTIVE"
        })
    })
    console.log(insertManyOps)
    //insert Many request
    let result = await dbs.mainDb.client.collection(dbs.mainDb.collections.itemOrders).insertMany(insertManyOps)
    result = result.ops

    //finding vendor for the item orders
    const esRes = await queries.esQueries.getMatchedVendors(dbs, {
        categories: createOrdersInput.categories,
        products: createOrdersInput.products
    })

    //getting vendors
    const vendors = []
    esRes.hits.hits.forEach((hit) => {
        vendors.push(hit._source)
    })
    console.log(vendors)
    //bulk generate vendor orders
    try {
        queries.mongoDbQueries.bulkCreateVendorOrders(dbs, result, vendors)
    } catch (e) {
        console.log("Placing vendor orders for the item failed with error: ", e)
    }

    return true
}

async function buyerGetActiveItemOrders(dbs, buyerId) {
    const result = await dbs.mainDb.client
        .collection(dbs.mainDb.collections.itemOrders)
        .find({
            buyerId: ObjectID(buyerId),
            status: "ACTIVE"
        })
        .sort({
            createdAt: -1
        })
        .toArray()

    //formatting response
    const formattedResponse = []
    result.forEach((element) => {
        formattedResponse.push({
            ...element,
            productParameters: JSON.stringify(element.productParameters)
        })
    })

    return formattedResponse
}

async function buyerGetItemDetails(dbs, orderId) {
    const result = await dbs.mainDb.client.collection(dbs.mainDb.collections.itemOrders).findOne({
        _id: ObjectID(orderId)
    })
    const formattedResponse = {
        ...result,
        productParameters: JSON.stringify(result.productParameters)
    }
    return formattedResponse
}

module.exports = {
    createItemOrders,
    buyerGetActiveItemOrders,
    buyerGetItemDetails
}
