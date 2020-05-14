const { ObjectID } = require("mongodb")
const { v4: uuidv4 } = require("uuid")

async function createItemOrders(dbs, queries, createOrdersInput, buyerId) {
    //get buyer's details
    const buyerProfileObject = dbs.mainDb.client.collection(dbs.mainDb.collections.buyerProfiles).findOne({
        buyerId: ObjectID(buyerId)
    })
    if (!buyerProfileObject) {
        return false
    }

    //get buyer's company details
    const companyProfileObject = dbs.mainDb.client.collection(dbs.mainDb.collections.companyProfiles).findOne({
        companyId: ObjectID(buyerObject.companyId)
    })
    if (!companyProfileObject) {
        return false
    }

    const buyerGroupId = uuidv4()

    //generating insert many operations for item Orders
    const insertManyOps = []
    createOrdersInput.item.forEach((element) => {
        insertManyOps.push({
            buyerId: ObjectID(buyerId),
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

            companyId: ObjectID(companyProfileObject.companyId),
            companyName: companyProfileObject.name,
            companyCity: companyProfileObject.city,
            companyState: companyProfileObject.state,
            companyLocationCoordinates: companyProfileObject.locationCoordinates,
            companyCountry: companyProfileObject.country,

            createdAt: new Date().getTime(),
            lastModified: new Date().getTime(),
            status: "ACTIVE"
        })
    })

    //insert Many request
    const result = await dbs.mainDb.client.collection(dbs.mainDb.collections.itemOrders).insertMany(insertManyOps)

    return true
}
