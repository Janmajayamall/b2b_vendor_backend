/* 
    This script should only be used for creating tables
*/
const AWS = require("aws-sdk")
const tableSchemas = require("./tableSchemas")

async function createTable(table, dynamodbClient) {
    try {
        const createTableResult = await dynamodbClient.createTable(table).promise()
        console.log(createTableResult, `table ${table["TableName"]} has been created`)
        return true
    } catch (e) {
        console.log(`table ${table["TableName"]} creation not successful with error: ${e}`)
        return false
    }
}

async function initializeTables() {
    //creating dynamodbClient
    const dynamodbClient = new AWS.DynamoDB({
        accessKeyId: process.env.AWS_DYNAMODB_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_DYNAMODB_SECRET_ACCESS_KEY,
        apiVersion: "2012-08-10",
        region: process.env.AWS_REGION
    })

    // creating tables
    await createTable(tableSchemas.companyProfiles.dynamoCreateTable, dynamodbClient)
    await createTable(tableSchemas.companies.dynamoCreateTable, dynamodbClient)
    await createTable(tableSchemas.vendors.dynamoCreateTable, dynamodbClient)
    await createTable(tableSchemas.vendorProfiles.dynamoCreateTable, dynamodbClient)
    await createTable(tableSchemas.buyers.dynamoCreateTable, dynamodbClient)
    await createTable(tableSchemas.buyerProfiles.dynamoCreateTable, dynamodbClient)
    await createTable(tableSchemas.vendorCategoryProducts.dynamoCreateTable, dynamodbClient)
    await createTable(tableSchemas.itemOrders.dynamoCreateTable, dynamodbClient)
    await createTable(tableSchemas.vendorOrders.dynamoCreateTable, dynamodbClient)
}

initializeTables()
