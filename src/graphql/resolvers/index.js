const vendors = require("./vendors")
const vendorProfiles = require("./vendorProfiles")
const vendorCategoryProducts = require("./vendorCategoryProducts")
const itemOrders = require("./itemOrders")
const buyers = require("./buyers")
const buyerProfiles = require("./buyerProfiles")
const companies = require("./companies")
const companyProfiles = require("./companyProfiles")
const vendorOrders = require("./vendorOrders")
const preferredVendors = require("./preferredVendors")
const awsServices = require("./awsServices")

module.exports = {
    Mutation: {
        ...vendors.Mutation,
        ...vendorCategoryProducts.Mutation,
        ...itemOrders.Mutation,
        ...vendorProfiles.Mutation,
        ...buyerProfiles.Mutation,
        ...buyers.Mutation,
        ...companies.Mutation,
        ...companyProfiles.Mutation,
        ...vendorOrders.Mutation,
        ...preferredVendors.Mutation
    },

    Query: {
        ...vendors.Query,
        ...vendorOrders.Query,
        ...itemOrders.Query,
        ...preferredVendors.Query,
        ...companyProfiles.Queries,
        ...awsServices.Query
    }
}
