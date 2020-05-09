const express = require("express")
const { ApolloServer, gql } = require("apollo-server-express")
const typeDefs = require("./src/graphql/typeDef")
const resolvers = require("./src/graphql/resolvers/index")
const AWS = require("aws-sdk")
const dynamodbQueries = require("./src/dynamodbQueries/index")
const esQueries = require("./src/elasticSearchQueries/index")

// Initialising the app
const app = express()

// Initializing dynamodb client
const dynamodbClient = new AWS.DynamoDB.DocumentClient({
    accessKeyId: process.env.AWS_DYNAMODB_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_DYNAMODB_SECRET_ACCESS_KEY,
    apiVersion: "2012-08-10",
    region: process.env.AWS_REGION
})

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

//Initialising ApolloServer
const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: ({ req }) => {
        return {
            reqHeaders: req.headers,

            //clients
            clients: {
                dynamodbClient: dynamodbClient,
                esClient: esClient
            },

            //queries
            queries: {
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

// //when nodemon restarts
// process.once('SIGUSR2', async function(){
//     // try{
//     //     await Promise.all([close_mongodb_connection(mongodb_connections.main_connection)])
//     //     process.kill(process.pid, 'SIGUSR2');
//     // }catch(e){
//     //     bugsnap_client.notify(e)
//     //     process.exit(1)
//     // }

// })

// // when app terminates
// process.on('SIGINT', async function() {
//     // try{
//     //     await Promise.all([close_mongodb_connection(mongodb_connections.main_connection)])
//     //     process.exit(0)
//     // }catch(e){
//     //     bugsnap_client.notify(e)
//     //     process.exit(1)
//     // }

// });
