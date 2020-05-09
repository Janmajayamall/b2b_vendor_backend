module.exports = {
    companyProfiles: {
        dynamoCreateTable: {
            AttributeDefinitions: [
                {
                    AttributeName: "id",
                    AttributeType: "S"
                }
            ],
            TableName: "company_profiles",
            KeySchema: [
                {
                    AttributeName: "id",
                    KeyType: "HASH"
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        },
        tableName: "company_profiles",
        esIndexName: "company_profiles"
        /**
        attributes:{
            -keys:
                id,
            -attributes:
                name, 
                country, 
                city, 
                address, 
                description,
                locationCoordinates:{
                    latitude,
                    longitude
                } 
                contactEmailId
                contactNumber,                
                website,
                linkedIn,
                createdAt,
                lastModified,
                status{
                    ACTIVE
                    NOT_ACTIVE
                }
        }
         */
    },

    companies: {
        dynamoCreateTable: {
            AttributeDefinitions: [
                {
                    AttributeName: "emailId",
                    AttributeType: "S"
                }
            ],
            TableName: "companies",
            KeySchema: [
                {
                    AttributeName: "emailId",
                    KeyType: "HASH"
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        },
        tableName: "companies",
        esIndexName: "companies"
        /**
        attributes:{
            -keys:
                emailId,
                
            -attributes:
                passwordHash,                
                id,                
                createdAt,
                lastModified,
                status{
                    ACTIVE
                    NOT_ACTIVE
                }
        }
         */
    },

    vendors: {
        dynamoCreateTable: {
            AttributeDefinitions: [
                {
                    AttributeName: "emailId",
                    AttributeType: "S"
                }
            ],
            TableName: "vendors",
            KeySchema: [
                {
                    AttributeName: "emailId",
                    KeyType: "HASH"
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        },
        tableName: "vendors",
        esIndexName: "vendors"
        /**
        attributes:{
            -keys:
                emailId,
                
            -attributes:
                passwordHash,                
                id,
                companyId,
                createdAt,
                lastModified,
                status{
                    ACTIVE
                    NOT_ACTIVE
                }
        }
         */
    },

    vendorProfiles: {
        dynamoCreateTable: {
            AttributeDefinitions: [
                {
                    AttributeName: "id",
                    AttributeType: "S"
                }
            ],
            TableName: "vendor_profiles",
            KeySchema: [
                {
                    AttributeName: "id",
                    KeyType: "HASH"
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        },
        tableName: "vendor_profiles",
        esIndexName: "vendor_profiles"
        /**
        attributes:{
            -keys:
                id,
                
            -attributes:
                name,                
                contactNumber
                contactEmailId,
                createdAt,
                lastModified,
                companyId
                status{
                    ACTIVE
                    NOT_ACTIVE
                }
        }
         */
    },

    buyers: {
        dynamoCreateTable: {
            AttributeDefinitions: [
                {
                    AttributeName: "emailId",
                    AttributeType: "S"
                }
            ],
            TableName: "buyers",
            KeySchema: [
                {
                    AttributeName: "emailId",
                    KeyType: "HASH"
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        },
        tableName: "buyers",
        esIndexName: "buyers"
        /**
        attributes:{
            -keys:
                emailId,
                
            -attributes:
                passwordHash,                
                id,
                companyId,
                createdAt,
                lastModified,
                status{
                    ACTIVE
                    NOT_ACTIVE
                }
        }
         */
    },

    buyerProfiles: {
        dynamoCreateTable: {
            AttributeDefinitions: [
                {
                    AttributeName: "id",
                    AttributeType: "S"
                }
            ],
            TableName: "buyer_profiles",
            KeySchema: [
                {
                    AttributeName: "id",
                    KeyType: "HASH"
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        },
        tableName: "buyer_profiles",
        esIndexName: "buyer_profiles"
        /**
        attributes:{
            -keys:
                id,
                
            -attributes:
                name,                
                contactNumber
                contactEmailId,
                createdAt,
                lastModified,
                companyId
                status{
                    ACTIVE
                    NOT_ACTIVE
                }
        }
         */
    },

    vendorCategoryProducts: {
        dynamoCreateTable: {
            AttributeDefinitions: [
                {
                    AttributeName: "vendorId",
                    AttributeType: "S"
                },
                {
                    AttributeName: "productsCategory",
                    AttributeType: "S"
                }
            ],
            TableName: "vendor_category_products",
            KeySchema: [
                {
                    AttributeName: "vendorId",
                    KeyType: "HASH"
                },
                {
                    AttributeName: "productsCategory",
                    KeyType: "RANGE"
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        },
        tableName: "vendor_category_products",
        esIndexName: "vendor_category_products"
        /**
        attributes:{
            -keys:
                vendorId, 
                productsCategory,

            -attributes:
                products,
                createdAt,
                lastModified,
                status{
                    ACTIVE,
                    NOT_ACTIVE
                }
        } 
         */
    },

    itemOrders: {
        dynamoCreateTable: {
            AttributeDefinitions: [
                {
                    AttributeName: "buyerId",
                    AttributeType: "S"
                },
                {
                    AttributeName: "id",
                    AttributeType: "S"
                }
            ],
            TableName: "item_orders",
            KeySchema: [
                {
                    AttributeName: "buyerId",
                    KeyType: "HASH"
                },
                {
                    AttributeName: "id",
                    KeyType: "RANGE"
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        },
        tableName: "item_orders",
        esIndexName: "item_orders"
        /**
        attributes:{
            -keys:
                id, --> orderId 
                buyerId,

            -attributes:

                //item attr
                buyerRfqId
                buyerPrId
                buyerItemId
                productName
                productDescription
                productParameters
                quantity
                unit
                termsAndConditions ,
                deliveryDays
                  
                
                //extra:
                buyerGroupId,
                createdAt,
                lastModified,
                status{
                    ACTIVE,
                    NOT_ACTIVE
                }
        } 
         */
    },

    vendorOrders: {
        dynamoCreateTable: {
            AttributeDefinitions: [
                {
                    AttributeName: "vendorId",
                    AttributeType: "S"
                },
                {
                    AttributeName: "orderId",
                    AttributeType: "S"
                }
            ],
            TableName: "vendor_orders",
            KeySchema: [
                {
                    AttributeName: "vendorId",
                    KeyType: "HASH"
                },
                {
                    AttributeName: "orderId",
                    KeyType: "RANGE"
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        },
        tableName: "vendor_orders",
        esIndexName: "vendor_orders"
        /**
        attributes:{
            -keys:
                vendorId, 
                orderId,

            -attributes:                                
                productName
                productDescription
                productParameters{}
                quantity
                unit
                termsAndConditions,
                buyerId

                //from vendor
                quotedProductName
                quotedProductDescription,
                quotedProductParameters{},
                quotedPricePerUnit
                quotedQuantity
                quotedUnit
                quotedDiscount                
                quotedDeliveryCost
                quotedLandingPrice
                quotedValidity
                quotedDeliveryDays
                status{
                    WAITING -> Vendor needs to accept
                    CANCELLED -> Vendor is no more quoting
                    QUOTED -> Vendor has quoted
                    REJECTED -> Buyers rejected vendor's quote
                    REVIEW -> Buyers is thinking of contacting
                    ACCEPTED -> Vendor has been selected for the item 
                }

                //extra 
                createdAt,
                lastModified
            

        } 
         */
    }
}
