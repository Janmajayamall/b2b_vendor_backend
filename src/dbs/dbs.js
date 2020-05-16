module.exports = {
    mainDb: {
        name: "mainDb",
        collections: {
            companyProfiles: "company_profiles",
            companies: "companies",
            vendors: "vendors",
            vendorProfiles: "vendor_profiles",
            buyers: "buyers",
            buyerProfiles: "buyerProfiles",
            vendorCategoryProducts: "vendor_category_products",
            itemOrders: "item_orders",
            vendorOrders: "vendor_orders"
        },
        client: null
    },
    es: {
        name: "es",
        indexes: {
            vendorCategoryProducts: "vendor_category_products"
        },
        client: null
    }
}
