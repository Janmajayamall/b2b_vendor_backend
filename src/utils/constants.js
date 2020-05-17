module.exports.constants = {
    tableLimits: {
        vendors: {
            name: 500,
            address: 500,
            description: 3000,
            email: 200
        }
    },
    errorCodes: {
        emailExists: "1",
        emailDoesNotExists: "2",
        noError: "0",
        invalidCreds: "3",
        profileAlreadyCreated: "4",
        recordNotFound: "5",
        unknownError: "1000"
    },
    esEvents: {
        create: "CREATE",
        update: "UPDATE",
        delete: "DELETE"
    }
}

/* 
points to remember
1. Dynamo db per char 1-4 bytes
    1 bytes = 0.001 kb
    therefore, 1000 bytes = 1 kb
    taking by the extreme side:
        dynamodb/item limit: 400kb = 400000 bytes
        hence, 
            400000/4 = 100000chars per item
            still keep around 80,000 chars
*/
