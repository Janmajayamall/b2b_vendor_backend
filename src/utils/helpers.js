function getInsertOneResult(response) {
    return response.ops[0]
}

module.exports = {
    getInsertOneResult
}
