const AWS = require("aws-sdk")

async function getSignedUrlPutObject(file_name, file_mime) {
    //initializing AWS auth for S3
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        signatureVersion: "v4"
    })

    const params = { Bucket: "b2b-vbc", Key: file_name, Expires: 60 * 5, ContentType: file_mime }
    var pre_signed_url = await s3.getSignedUrl("putObject", params)
    return pre_signed_url
}

module.exports = {
    getSignedUrlPutObject
}
