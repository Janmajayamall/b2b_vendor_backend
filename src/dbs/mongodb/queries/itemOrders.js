const { ObjectID, Double } = require("mongodb")
const { v4: uuidv4 } = require("uuid")
const {} = require("./../../../utils/index")

async function createItemOrders(dbs, queries, createOrdersInput, buyerId) {
    // console.log(createOrdersInput, "createItemOrders - createOrdersInput")
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
            status: "ACTIVE",
            productFile: element.productFile.trim()
        })
    })

    //insert Many request
    let result = await dbs.mainDb.client.collection(dbs.mainDb.collections.itemOrders).insertMany(insertManyOps)
    result = result.ops

    /**
     * Getting matching vendors
     * 1. Get vendorIds of all preferred vendor companies
     * 2. Find vendors for item orders from es
     */
    let vendorsIds = []

    //step 1
    const chosenPreferredVendors = createOrdersInput.chosenPreferredVendors
    for (let i = 0; i < chosenPreferredVendors.length; i++) {
        //making sure that the company of buyer & preferred vendor is not equal
        if (ObjectID(chosenPreferredVendors[i]).equals(ObjectID(buyerProfileObject.companyId))) {
            continue
        }

        //getting vendors from preferred company
        const companyVendors = await dbs.mainDb.client
            .collection(dbs.mainDb.collections.vendorProfiles)
            .find({
                companyId: ObjectID(chosenPreferredVendors[i])
            })
            .toArray()
        companyVendors.forEach((object) => {
            vendorsIds.push(object.vendorId.toString())
        })
    }

    //step 2
    //finding vendor for the item orders
    const esRes = await queries.esQueries.getMatchedVendors(dbs, {
        categories: createOrdersInput.categories,
        products: createOrdersInput.products
    })
    esRes.hits.hits.forEach((hit) => {
        vendorsIds.push(hit._source.vendorId)
    })
    console.log("creatItemOrders final vendorIds: ", vendorsIds)
    //bulk generate vendor orders
    try {
        queries.mongoDbQueries.bulkCreateVendorOrders(dbs, result, vendorsIds)
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

async function buyerSearchOrders(dbs, buyerId, searchQuery) {
    let filters = {
        buyerId: ObjectID(buyerId)
    }

    //building search queries
    if (searchQuery.buyerRfqId != undefined && searchQuery.buyerRfqId !== "") {
        filters.buyerRfqId = searchQuery.buyerRfqId.trim()
    }
    if (searchQuery.buyerPrId != undefined && searchQuery.buyerPrId !== "") {
        filters.buyerPrId = searchQuery.buyerPrId.trim()
    }
    if (searchQuery.buyerItemId != undefined && searchQuery.buyerItemId !== "") {
        filters.buyerItemId = searchQuery.buyerItemId.trim()
    }
    if (searchQuery.productName != undefined && searchQuery.productName !== "") {
        filters.productName = searchQuery.productName.trim()
    }
    if (searchQuery.orderId != undefined && searchQuery.orderId !== "") {
        filters._id = ObjectID(searchQuery.orderId.trim())
    }
    if (searchQuery.status != undefined && searchQuery.status !== "") {
        filters.status = searchQuery.status.trim()
    }
    if (searchQuery.dateRange != undefined && Object.keys(searchQuery.dateRange).length > 0) {
        filters.createdAt = {
            $gte: searchQuery.dateRange.startDate,
            $lte: searchQuery.dateRange.endDate
        }
    }

    //TODO: handle date range

    const result = await dbs.mainDb.client
        .collection(dbs.mainDb.collections.itemOrders)
        .find(filters)
        .sort({ createdAt: -1 })
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

module.exports = {
    createItemOrders,
    buyerGetActiveItemOrders,
    buyerGetItemDetails,
    buyerSearchOrders
}
