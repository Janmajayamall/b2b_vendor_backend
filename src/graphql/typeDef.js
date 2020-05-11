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
        vendorId: ID!
        productsCategory: String!
        products: [String!]
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
        deliveryDays: Float!
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
        addCategoryProducts(userInput: addCategoryProductsInput!): Boolean!

        #itemOrders
        createItemOrders(userInput: createItemOrdersInput!): Boolean!
        # buyerGetItemOrders(buyerId):

        #companies
        registerCompany(userInput: registerCompanyInput): AuthenticationResponse!
        loginCompany(userInput: registerCompanyInput): AuthenticationResponse!

        #companyProfiles
        createCompanyProfile(userInput: createCompanyProfileInput!): Boolean!
    }

    type Query {
        s: Boolean!
    }
`
