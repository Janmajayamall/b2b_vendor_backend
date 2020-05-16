const express = require("express")
const { ApolloServer, gql } = require("apollo-server-express")
const typeDefs = require("./src/graphql/typeDef")
const resolvers = require("./src/graphql/resolvers/index")
const AWS = require("aws-sdk")
const dynamodbQueries = require("./src/dynamodbQueries/index")
const esQueries = require("./src/dbs/es/queries/index")
const initializingMongodb = require("./src/dbs/mongodb/mongoDbConnections")
const dbs = require("./src/dbs/dbs")
const mainDbCollections = require("./src/dbs/mongodb/schema/mainDbCollections")
const mongoDbQueries = require("./src/dbs/mongodb/queries/index")

let mongoDbConnections = null

//create table indicator
let createMongodbTables = true //Change this if you want to create tables

//Initializing mongodb connections
initializingMongodb
    .connectMongoDbs()
    .then(async (connections) => {
        mongoDbConnections = connections

        // assigning clients to mongoDb connections
        dbs.mainDb.client = mongoDbConnections.mainConnection.db(dbs.mainDb.name)

        //creating mongoDb collections
        if (createMongodbTables === true) {
            //mainDb collections
            await mainDbCollections.createCompanyProfiles(dbs.mainDb)
            await mainDbCollections.createCompanies(dbs.mainDb)
            await mainDbCollections.createVendors(dbs.mainDb)
            await mainDbCollections.createVendorProfiles(dbs.mainDb)
            await mainDbCollections.createBuyers(dbs.mainDb)
            await mainDbCollections.createBuyerProfiles(dbs.mainDb)
            await mainDbCollections.createVendorCategoryProducts(dbs.mainDb)
            await mainDbCollections.createItemOrders(dbs.mainDb)
            await mainDbCollections.createVendorOrders(dbs.mainDb)
        }

        console.log("Connected to mongodb")
    })
    .catch((e) => {
        console.log("Failed to connect to mongoDb, index.js, with Error: ", e)
    })

// Initialising the app
const app = express()

//Initializing es client
let options = {
    hosts: ["https://search-es-dynamodb-sync-zoxgzth4k7jae3x4sdzxle6xwy.ap-south-1.es.amazonaws.com"], // array of amazon es hosts (required)
    connectionClass: require("http-aws-es"), // use this connector (required)
    awsConfig: new AWS.Config({
        region: process.env.AWS_REGION,
        credentials: new AWS.Credentials({
            accessKeyId: process.env.AWS_DYNAMODB_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_DYNAMODB_SECRET_ACCESS_KEY
        })
    }),
    httpOptions: {} // set httpOptions on aws-sdk's request. default to aws-sdk's config.httpOptions
}

const esClient = require("elasticsearch").Client(options)
//assigning esClient to es
dbs.es.client = esClient

//Initialising ApolloServer
const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: ({ req }) => {
        return {
            reqHeaders: req.headers,

            //dbs
            dbs: dbs,

            //queries
            queries: {
                mongoDbQueries: mongoDbQueries,
                dynamodbQueries: dynamodbQueries,
                esQueries: esQueries
            }
        }
    }
})

server.applyMiddleware({ app })

//Starting the server
app.listen({ port: process.env.PORT || 3000 }, function () {
    console.log(`Server started on http://localhost:${process.env.PORT || 3000}${server.graphqlPath}`)
})

//closing the connection
function closeMongoDbConnections(connection) {
    if (connection) {
        connection.close().then((w) => {
            console.log("MongoDB Connection Closed")
            return
        })
    } else {
        return
    }
}

//when nodemon restarts
process.once("SIGUSR2", async function () {
    try {
        if (mongoDbConnections !== null) {
            await Promise.all([closeMongoDbConnections(mongoDbConnections.mainConnection)])
            process.kill(process.pid, "SIGUSR2")
        }
    } catch (e) {
        process.exit(1)
    }
})

// when app terminates
process.on("SIGINT", async function () {
    try {
        if (mongoDbConnections !== null) {
            await Promise.all([closeMongoDbConnections(mongoDbConnections.mainConnection)])
            process.exit(0)
        }
    } catch (e) {
        process.exit(1)
    }
})

// // Initializing dynamodb client
// const dynamodbClient = new AWS.DynamoDB.DocumentClient({
//     accessKeyId: process.env.AWS_DYNAMODB_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_DYNAMODB_SECRET_ACCESS_KEY,
//     apiVersion: "2012-08-10",
//     region: process.env.AWS_REGION
// })
