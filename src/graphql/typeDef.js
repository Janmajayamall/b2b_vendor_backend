const { gql } = require("apollo-server-express")

module.exports = gql`
    """
    type LocationCoordinates
    Used for describing the location of the company/user
    """
    type LocationCoordinates {
        lat: String!
        lon: String!
    }

    """
    input locationCoordinates
    User for assigning locationCoordinates to a company/user
    """
    input locationCoordinates {
        lat: String!
        lon: String!
    }

    """
    input registerVendorInput
    Used for registration of vendor, along with its profile
    """
    input registerVendorInput {
        emailId: String!
        password: String!
        name: String!
        contactEmailId: String!
        contactNumber: String!
    }

    """
    input registerBuyerInput
    User for registration of buyer, along with its profile
    """
    input registerBuyerInput {
        emailId: String!
        password: String!
        name: String!
        contactEmailId: String!
        contactNumber: String!
    }

    """
    input loginInput
    Used for login by any type of user
    """
    input loginInput {
        emailId: String!
        password: String!
    }

    """
    input addCategoryProductsInput
    Used for adding productsCategory & products array for the vendor
    """
    input addCategoryProductsInput {
        productsCategory: String!
        products: [String!]!
    }

    """
    input itemInput
    Used for input of individual items from buyer
    """
    input itemInput {
        buyerRfqId: ID!
        buyerPrId: ID!
        buyerItemId: ID!
        productName: String!
        productDescription: String!
        productParameters: String!
        quantity: Float!
        unit: String!
        termsAndConditions: String!
        deliveryDays: String!
    }

    """
    input createItemOrdersInput
    Used for creating orders for several items requested by buyer (one rfq)
    """
    input createItemOrdersInput {
        categories: [String!]!
        products: [String!]!
        items: [itemInput!]!
    }

    """
    type BuyerItemOrder
    Used for displaying buyer's item order details
    """
    type BuyerItemOrder {
        _id: ID!
        buyerId: ID!
        buyerName: String!
        buyerRfqId: String!
        buyerPrId: String!
        buyerItemId: String!
        productName: String!
        productDescription: String!
        productParameters: String!
        quantity: Float!
        unit: String!
        termsAndConditions: String!
        deliveryDays: String!
        buyerGroupId: String!
        createdAt: String!
        lastModified: String!
        status: String!
    }

    """
    input registerCompanyInput
    Used for registration/Login for the company with admin's emailid
    """
    input registerCompanyInput {
        emailId: String!
        password: String!
    }

    """
    input createCompanyProfileInput
    Used for creating the company profile for the first time after registration
    """
    input createCompanyProfileInput {
        name: String!
        country: String!
        city: String!
        state: String!
        address: String!
        description: String!
        locationCoordinates: locationCoordinates!
        contactEmailId: String!
        contactNumber: String!
        website: String!
        linkedIn: String!
    }

    """
    type Authentication Response
    Used for sending back response on authentication (login/registration)
    """
    type AuthenticationResponse {
        jwt: String
        profileCreated: Boolean
        error: String
    }

    """
    type ErrorStateResponse
    Used for response containing just error state
    """
    type ErrorStateResponse {
        error: String!
    }

    """
    type VendorOrderSimple
    Used for defining response type of vendor order when showing
    all orders in a form of list
    """
    type VendorOrderSimple {
        vendorId: ID!
        orderId: ID!

        # buyer's input
        productName: String!
        productDescription: String!
        quantity: Float!
        unit: String!
        termsAndConditions: String!
        deliveryDays: String!
        buyerId: ID!
        buyerName: String!
        companyId: ID!
        companyName: String!
        companyCity: String!
        companyState: String!
        companyLocationCoordinates: [Float!]!
        companyCountry: String!
    }

    """
    type VendorOrderDetails
    Used for defining response type of vendor order when showing
    order in detail
    """
    type VendorOrderDetails {
        vendorId: ID!
        orderId: ID!

        # buyer's input
        productName: String!
        productDescription: String!
        quantity: Float!
        unit: String!
        termsAndConditions: String!
        productParameters: String!
        deliveryDays: String!
        buyerId: ID!
        buyerName: String!
        companyId: ID!
        companyName: String!
        companyCity: String!
        companyState: String!
        companyLocationCoordinates: [Float!]!
        companyCountry: String!

        # vendor's input
        quotedProductName: String!
        quotedProductDescription: String!
        quotedProductParameters: String!
        quotedPricePerUnit: Float!
        quotedQuantityPrice: Float!
        quotedQuantity: Float!
        quotedUnit: String!
        quotedDiscount: Float!
        quotedDeliveryCost: Float!
        quotedLandingPrice: Float!
        quotedPriceCurrency: String!
        quotedValidity: Float!
        quotedDeliveryDays: String!
        quotedTermsAndConditions: String!
        status: String!

        # vendor's company
        vendorName: String!
        vendorCompanyName: String!
        vendorCompanyId: ID!
        vendorCompanyCity: String!
        vendorCompanyState: String!
        vendorCompanyLocationCoordinates: [Float!]

        createdAt: String!
        lastModified: String!
    }

    """
    type VendorQuoteSimple
    Used for showing quotations to they buyer as list
    """
    type VendorQuotationSimple {
        # vendor's input
        quotedProductName: String!
        quotedProductDescription: String!
        quotedProductParameters: String!
        quotedPricePerUnit: Float!
        quotedQuantityPrice: Float!
        quotedQuantity: Float!
        quotedUnit: String!
        quotedDiscount: Float!
        quotedDeliveryCost: Float!
        quotedLandingPrice: Float!
        quotedPriceCurrency: String!
        quotedValidity: Float!
        quotedDeliveryDays: String!
        quotedTermsAndConditions: String!
        status: String!

        # vendor's company
        vendorName: String!
        vendorCompanyName: String!
        vendorCompanyId: ID!
        vendorCompanyCity: String!
        vendorCompanyState: String!
        vendorCompanyLocationCoordinates: [Float!]
    }

    """
    input updateVendorOrderDetails
    used for updating vendor order details
    used in scenarios like user submitting quotation
    user editing it & rest
    """
    input updateVendorOrderDetailsInput {
        quotedProductName: String
        quotedProductDescription: String
        quotedProductParameters: String
        quotedPricePerUnit: Float
        quotedQuantityPrice: Float
        quotedQuantity: Float
        quotedUnit: String
        quotedDiscount: Float
        quotedDeliveryCost: Float
        quotedLandingPrice: Float
        quotedPriceCurrency: String
        quotedValidity: Float
        quotedDeliveryDays: String
        quotedTermsAndConditions: String
    }

    type ItemOrderDetailsResponse {
        error: String!
        itemOrder: VendorOrderDetails
    }

    """
    input quotationFiltersSortInput
    Used for sorting quotations
    """
    input quotationFiltersSortInput {
        nearest: Boolean
    }

    """
    input quotationFiltersInput
    Used for applying filters on returned quotations list
    """
    input quotationFiltersInput {
        city: String
        state: String
        country: String
        preferredVendors: Boolean
        sort: quotationFiltersSortInput
    }

    """
    input getItemOrderQuotationsInput
    Used for getting quotations of item order & corresponding filters
    """
    input getItemOrderQuotationsInput {
        orderId: ID!
        quotationFilters: quotationFiltersInput!
    }

    type Mutation {
        #vendors
        registerVendor(userInput: registerVendorInput!): ErrorStateResponse!
        loginVendor(userInput: loginInput!): AuthenticationResponse!

        #vendorProfiles

        #buyers
        registerBuyer(userInput: registerBuyerInput!): ErrorStateResponse!
        loginBuyer(userInput: loginInput!): AuthenticationResponse!

        #buyerProfiles

        #vendorCategoryProducts
        addCategoryProducts(userInput: [addCategoryProductsInput!]!): Boolean!

        #itemOrders
        createItemOrders(userInput: createItemOrdersInput!): Boolean!

        #vendorOrders
        updateVendorOrderDetails(orderId: ID!, userInput: updateVendorOrderDetailsInput!): ErrorStateResponse!
        rejectItemOrder(orderId: ID!): Boolean!

        #companies
        registerCompany(userInput: registerCompanyInput): AuthenticationResponse!
        loginCompany(userInput: registerCompanyInput): AuthenticationResponse!

        #companyProfiles
        createCompanyProfile(userInput: createCompanyProfileInput!): ErrorStateResponse!
    }

    type Query {
        s: Boolean!

        #vendorOrders
        getIncomingVendorOrders: [VendorOrderSimple!]!
        getItemOrderDetails(orderId: ID!): ItemOrderDetailsResponse!
        getItemOrderQuotations(userInput: getItemOrderQuotationsInput!): [VendorQuotationSimple!]!

        #itemOrders
        buyerGetActiveItemOrders: [BuyerItemOrder!]!
        buyerGetItemDetails(orderId: ID!): BuyerItemOrder!
    }
`
