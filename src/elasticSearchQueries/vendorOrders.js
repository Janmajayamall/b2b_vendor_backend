const tableSchemas = require("../../tableSchemas")

async function getVendorOrders(esClient, vendorId) {

    let esQuery ={
        query:{
            term:{
                "vendorId.keyword":vendorId
            }
        }
    }

    const result = await esClient.search({
        index:tableSchemas.vendorOrders.esIndexName,
        body: 
    })
}
