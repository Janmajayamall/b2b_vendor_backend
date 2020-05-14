import { ObjectID } from "mongodb"

async function addCategoryProducts(dbs, addObjectArr, vendorId) {
    /**
     * TODO: put a limit on number of items that can be inserted
     *
     * In this case we are using for loop instead of using bulk writes, because
     * we need to check for duplicates in productsCategory
     */

    //insert operations in loop
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

            const result = await dbs.mainDb.client.collection(dbs.mainDb.collections.vendorCategoryProducts).insertOne({
                vendorId: ObjectID(vendorId),
                productsCategory: addObjectArr[i].productsCategory.trim(),
                products: addObjectArr[i].products,
                createdAt: new Date(),
                lastModified: new Date(),
                status: "ACTIVE"
            })
        } catch (e) {
            console.log("error in addCategoryProducts vendorCategoryProducts.js: ", e)
        }
    }

    return true
}

module.exports = {
    addCategoryProducts
}
