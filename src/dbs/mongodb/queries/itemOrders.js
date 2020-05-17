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
    buyerGetActiveItemOrders
}

// {
//     "_id": {
//         "$oid": "5ebee0a54d8689fcf3bda71d"
//     },
//     "buyerId": {
//     "$oid":"507f1f77bcf86cd799439011"
// },
//     "buyerRfqId": "element.buyerRfqId.trim()",
//     "buyerPrId": "element.buyerPrId.trim()",
//     "buyerItemId": "element.buyerItemId.trim()",
//     "productName": "element.productName.trim()",
//     "productDescription": "element.productDescription.trim()",
//     "quantity":3.2323,
//     "unit": "element.unit.trim()",
//     "termsAndConditions": "element.termsAndConditions.trim()",
//     "productParameters": { "dwdad": "dawd" },
//     "deliveryDays": 4.2,
//     "buyerGroupId": "e15aa62e-5d03-4c0d-af36-c4f9e124c66f",
//     "companyId": {
//         "$oid":"507f1f77bcf86cd799439011"
//     },
//     "companyName": "companyProfileObject.name",
//     "companyCity": "companyProfileObject.city",
//     "companyState": "companyProfileObject.state",
//     "companyLocationCoordinates": [ "as" ],
//     "companyCountry": " companyProfileObject.country",
//     "createdAt": "2020-05-15T18:31:30.472Z",
//     "lastModified": "2020-05-15T18:31:30.472Z",
//     "status": "ACTIVE"
// }

// Reason: [18:37:24.130] Error running insert command for 'mainDb.item_orders' on process 'cluster0-shard-00-02-9n0o8.mongodb.net:27017' : [18:37:24.130] Error executing WithClientFor() for cp=cluster0-shard-00-02-9n0o8.mongodb.net:27017 (local=true) connectMode=SingleConnect : [18:37:24.130] Error running command for runCommandWithTimeout(dbName=mainDb, cmd=[{insert item_orders} {documents [[{_id ObjectID("5ebee0a54d8689fcf3bda71d")} {buyerId ObjectID("507f1f77bcf86cd799439011")} {buyerRfqId element.buyerRfqId.trim()} {buyerPrId element.buyerPrId.trim()} {buyerItemId element.buyerItemId.trim()} {productName element.productName.trim()} {productDescription element.productDescription.trim()} {quantity 3.2323} {unit element.unit.trim()} {termsAndConditions element.termsAndConditions.trim()} {productParameters [{dwdad dawd}]} {deliveryDays 4.2} {buyerGroupId e15aa62e-5d03-4c0d-af36-c4f9e124c66f} {companyId ObjectID("507f1f77bcf86cd799439011")} {companyName companyProfileObject.name} {companyCity companyProfileObject.city} {companyState companyProfileObject.state} {companyLocationCoordinates [as]} {companyCountry companyProfileObject.country} {createdAt 2020-05-15T18:31:30.472Z} {lastModified 2020-05-15T18:31:30.472Z} {status ACTIVE}]]} {writeConcern map[w:1]}]) : result="" identityUsed=mms-automation@admin[[MONGODB-CR/SCRAM-SHA-1]][24] : write command error: [{write errors: [{Document failed validation}]}, {<nil>}]
