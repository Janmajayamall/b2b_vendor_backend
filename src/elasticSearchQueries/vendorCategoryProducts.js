const tableSchemas = require("../../tableSchemas")

async function getMatchedVendors(esClient, matchObject) {
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

    const result = await esClient.search({
        index: tableSchemas.vendorCategoryProducts.esIndexName,
        body: esQuery
    })

    return result
}

module.exports = {
    getMatchedVendors
}
