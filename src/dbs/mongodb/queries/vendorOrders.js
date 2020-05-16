const { ObjectID, Double } = require("mongodb")

async function bulkCreateVendorOrders(dbs, itemOrdersOps, vendors) {
    //looping through each vendor & placing order to each vendor ONE by ONE
    for (let index = 0; index < vendors.length; index++) {
        //getting vendorProfile
        const vendorProfile = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorProfiles).findOne({
            vendorId: ObjectID(vendors[index].vendorId)
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
            vendorOperation.vendorId = ObjectID(vendors[index].vendorId)

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
            vendorOperation.quotedQuantity = order.quantity
            vendorOperation.quotedUnit = order.unit
            vendorOperation.quotedDiscount = Double(0.0)
            vendorOperation.quotedDeliveryCost = Double(0.0)
            vendorOperation.quotedLandingPrice = Double(0.0)
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
            vendorId: ObjectID(vendorId)
        })
        .toArray()
    console.log(result)
    return result
}
module.exports = {
    bulkCreateVendorOrders,
    getIncomingVendorOrders
}
