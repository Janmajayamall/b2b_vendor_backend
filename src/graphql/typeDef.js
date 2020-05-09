const { gql } = require("apollo-server-express")

module.exports = gql`
    """
    type PointOfContact
    Used for pointOfContact within the company
    that is being registered
    """
    type PointOfContact {
        name: String!
        contactNumber: String
    }

    """
    type LocationCoordinates
    Used for describing the location of the company/user
    """
    type LocationCoordinates {
        lat: String!
        lon: String!
    }

    """
    input pointOfContact
    Used for assigning point of contact for people within
    a company
    """
    input pointOfContact {
        name: String!
        contactNumber: String
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
    Used for registration of vendors
    """
    input registerVendorInput {
        emailId: String!
        password: String!
    }

    """
    input createVendorProfileInput
    User for creating vendor profile
    """
    input createVendorProfileInput {
        name: String!
        contactEmailId: String!
        contactNumber: String!
        companyId: String!
    }

    """
    input registerBuyerInput
    Used for registration of vendors
    """
    input registerBuyerInput {
        emailId: String!
        password: String!
    }

    """
    input createBuyerProfileInput
    User for creating vendor profile
    """
    input createBuyerProfileInput {
        name: String!
        contactEmailId: String!
        contactNumber: String!
        companyId: String!
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
        quantity: String!
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

    type Mutation {
        #vendors
        registerVendor(userInput: registerVendorInput!): Boolean!

        #vendorProfiles
        createVendorProfile(userInput: createVendorProfileInput!): Boolean!

        #buyers
        registerBuyer(userInput: registerBuyerInput): Boolean!

        #buyerProfiles
        createBuyerProfile(userInput: createBuyerProfileInput!): Boolean!

        #vendorCategoryProducts
        addCategoryProducts(userInput: addCategoryProductsInput!): Boolean!

        #itemOrders
        createItemOrders(userInput: createItemOrdersInput!): Boolean!

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
