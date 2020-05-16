const { ObjectID } = require("mongodb")
const { getInsertOneResult, constants } = require("./../../../utils/index")

async function addCategoryProducts(dbs, queries, addObjectArr, vendorId) {
    /**
     * TODO: put a limit on number of items that can be inserted
     *
     * In this case we are using for loop instead of using bulk writes, because
     * we need to check for duplicates in productsCategory
     */

    //getting vendor's profile
    const vendorProfile = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorProfiles).findOne({
        vendorId: ObjectID(vendorId)
    })
    if (!vendorProfile) {
        return false
    }

    //insert operations in loop
    const operationsResponse = []
    for (let i = 0; i < addObjectArr.length; i++) {
        try {
            //check whether category already exists or not
            const checkRes = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorCategoryProducts).findOne({
                vendorId: ObjectID(vendorId),
                productsCategory: addObjectArr[i].productsCategory.trim()
            })
            if (checkRes) {
                continue
            }

            let result = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorCategoryProducts).insertOne({
                vendorId: ObjectID(vendorId),
                productsCategory: addObjectArr[i].productsCategory.trim(),
                products: addObjectArr[i].products,
                companyId: ObjectID(vendorProfile.companyId),
                createdAt: new Date(),
                lastModified: new Date(),
                status: "ACTIVE"
            })

            operationsResponse.push(getInsertOneResult(result))
        } catch (e) {
            console.log("error in addCategoryProducts vendorCategoryProducts.js: ", e)
        }
    }

    queries.esQueries.syncEsVendorCategories(dbs, operationsResponse, constants.esEvents.create)

    return true
}

module.exports = {
    addCategoryProducts
}
