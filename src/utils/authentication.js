const bcrypt = require("bcrypt")
const jsonwebtoken = require("jsonwebtoken")
const fs = require("fs")
const path = require("path")
const { AuthenticationError } = require("apollo-server-express")

//importing PRIV_KEY
const path_to_priv_key = path.join(__dirname, "../../", "id_rsa_priv.pem")
const PRIV_KEY = fs.readFileSync(path_to_priv_key, "utf-8")
//importing PUB_KEY
const path_to_pub_key = path.join(__dirname, "../../", "id_rsa_pub.pem")
const PUB_KEY = fs.readFileSync(path_to_pub_key, "utf-8")

async function generatePasswordHash(password) {
    try {
        hash = await bcrypt.hash(password, 10)
        return hash
    } catch (e) {
        console.error(e, "generatePasswordHash function | authentication.js")
        throw Error(e)
    }
}

async function verifyPasswordHash(hash, password) {
    try {
        result = await bcrypt.compare(password, hash)
        return result
    } catch (e) {
        console.error(e, "verifyPasswordHash | authentication.js")
        throw Error(e)
    }
}

async function issueJwt(id) {
    //days to expire
    const expires_in = "1d"

    const payload = {
        sub: id,
        iat: Date.now()
    }

    const signedJwt = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expires_in, algorithm: "RS256" })

    return `Bearer ${signedJwt}`
}

async function verifyJwt(jwt) {
    try {
        const token = jwt.split(" ")[1].trim()

        if (!token) {
            throw new AuthenticationError(`JWT should in format "Bearer [token]"`)
        }

        return jsonwebtoken.verify(
            token,
            PUB_KEY,
            { ignoreExpiration: true, algorithms: ["RS256"] },
            (err, payload) => {
                if (err && err.name === "TokenExpiredError") {
                    throw new AuthenticationError("Token Expired")
                }

                if (err && err.name === "JsonWebTokenError") {
                    throw new AuthenticationError("JWT malformed")
                }

                return payload.sub
            }
        )
    } catch (e) {
        console.error(e, "verify_jwt function | authentication.js")
        throw new AuthenticationError(`JWT should in format "Bearer [token]"`)
    }
}

function generatePasswordVerificationCode() {
    var digits = "0123456789"

    var otp_length = 4

    var otp = ""

    for (let i = 1; i <= otp_length; i++) {
        var index = Math.floor(Math.random() * digits.length)

        otp = otp + digits[index]
    }

    return otp
}

module.exports = {
    generatePasswordHash,
    verifyPasswordHash,
    issueJwt,
    verifyJwt,
    generatePasswordVerificationCode
}
