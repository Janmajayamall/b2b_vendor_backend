const { constants } = require("./../../../utils/index")
async function getMatchedVendors(dbs, matchObject) {
    // generating match prefixes queries
    let matchPrefixesQuery = []
    //products
    matchObject.products.forEach((element) => {
        matchPrefixesQuery.push({
            match_phrase_prefix: {
                products: {
                    query: element
                }
            }
        })
    })
    //categories
    matchObject.categories.forEach((element) => {
        matchPrefixesQuery.push({
            match_phrase_prefix: {
                productsCategory: {
                    query: element
                }
            }
        })
    })

    let esQuery = {
        query: {
            bool: {
                should: matchPrefixesQuery,
                minimum_should_match: 1
            }
        }
    }

    const result = await dbs.es.client.search({
        index: dbs.es.indexes.vendorCategoryProducts,
        // _source: ["vendorId"],
        body: esQuery
    })

    return result
}

async function esBulkIndexCategories(dbs, operations) {
    const body = operations.flatMap((doc) => {
        const tempDoc = {
            ...doc,
            id: doc._id
        }
        delete tempDoc._id
        return [
            { index: { _index: dbs.es.indexes.vendorCategoryProducts, _id: String(doc._id), _type: "_doc" } },
            tempDoc
        ]
    })

    const result = await dbs.es.client.bulk({
        refresh: true,
        body: body
    })

    console.log(result.items[0].index, "result bulk categories")

    return result
}

async function syncEsVendorCategories(dbs, operations, eventType) {
    //if length of operations is zero then return
    if (operations.length === 0) {
        return
    }

    try {
        //create
        if (constants.esEvents.create === eventType) {
            const result = await esBulkIndexCategories(dbs, operations)
            return result
        }
    } catch (e) {
        console.log(`Error in syncEsVendorCategories with evenType:${eventType} & error: ${e}`)
    }
}

module.exports = {
    getMatchedVendors,
    syncEsVendorCategories
}
