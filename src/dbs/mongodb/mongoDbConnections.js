const MongoClient = require("mongodb").MongoClient
const Logger = require("mongodb").Logger

// connecting to the database
function connect(url) {
    return MongoClient.connect(url, { useUnifiedTopology: true }).then((client) => {
        Logger.setLevel("debug")
        Logger.setLevel("error")
        Logger.setLevel("info")
        Logger.setCurrentLogger(function (msg, context) {
            console.log(msg, context, "MongDb Logger")
        })
        return client
    })
}

async function connectMongoDbs() {
    try {
        // connecting to Mongodb server uri
        let MONGO_URL = process.env.MONGODB_URL
        console.log(MONGO_URL, "dadadad")
        if (MONGO_URL === undefined) {
            throw new Error("MONGO_URL not defined; process.env not set")
        }

        let databases = await Promise.all([connect(MONGO_URL)])
        return {
            mainConnection: databases[0]
        }
    } catch (e) {
        console.error(e, "Unable to connect to the database")
        process.exit()
    }
}

module.exports = {
    connectMongoDbs
}
