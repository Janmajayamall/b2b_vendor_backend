async function createCompanyProfiles(mainDb) {
    var result = await mainDb.client.createCollection(mainDb.collections.companyProfiles, {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: [
                    "companyId",
                    "name",
                    "country",
                    "city",
                    "state",
                    "address",
                    "description",
                    "locationCoordinates",
                    "contactEmailId",
                    "contactNumber",
                    "website",
                    "linkedIn",
                    "createdAt",
                    "lastModified",
                    "status"
                ],
                properties: {
                    companyId: {
                        bsonType: "objectId",
                        description: "required"
                    },
                    name: {
                        bsonType: "string",
                        description: "required"
                    },
                    country: {
                        bsonType: "string",
                        description: "required"
                    },
                    city: {
                        bsonType: "string",
                        description: "required"
                    },
                    state: {
                        bsonType: "string",
                        description: "required"
                    },
                    address: {
                        bsonType: "string",
                        description: "required"
                    },
                    description: {
                        bsonType: "string",
                        description: "required"
                    },
                    locationCoordinates: {
                        bsonType: "array",
                        description: "required"
                    },
                    contactEmailId: {
                        bsonType: "string",
                        description: "required"
                    },
                    contactNumber: {
                        bsonType: "string",
                        description: "required"
                    },
                    website: {
                        bsonType: "string",
                        description: "required"
                    },
                    linkedIn: {
                        bsonType: "string",
                        description: "required"
                    },
                    createdAt: {
                        bsonType: "date",
                        description: "required"
                    },
                    lastModified: {
                        bsonType: "date",
                        description: "required"
                    },
                    status: {
                        bsonType: "string",
                        description: "required"
                    }
                }
            }
        }
    })
    return result
}

async function createCompanies(mainDb) {
    var result = await mainDb.client.createCollection(mainDb.collections.companies, {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["emailId", "passwordHash", "createdAt", "lastModified", "status"],
                properties: {
                    emailId: {
                        bsonType: "string",
                        description: "required"
                    },
                    passwordHash: {
                        bsonType: "string",
                        description: "required"
                    },
                    createdAt: {
                        bsonType: "date",
                        description: "required"
                    },
                    lastModified: {
                        bsonType: "date",
                        description: "required"
                    },
                    status: {
                        bsonType: "string",
                        description: "required"
                    }
                }
            }
        }
    })
    return result
}

async function createVendors(mainDb) {
    var result = await mainDb.client.createCollection(mainDb.collections.vendors, {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["emailId", "passwordHash", "createdAt", "lastModified", "status", "companyId"],
                properties: {
                    emailId: {
                        bsonType: "string",
                        description: "required"
                    },
                    passwordHash: {
                        bsonType: "string",
                        description: "required"
                    },
                    companyId: {
                        bsonType: "objectId",
                        description: "required"
                    },
                    createdAt: {
                        bsonType: "date",
                        description: "required"
                    },
                    lastModified: {
                        bsonType: "date",
                        description: "required"
                    },
                    status: {
                        bsonType: "string",
                        description: "required"
                    }
                }
            }
        }
    })
    return result
}

async function createVendorProfiles(mainDb) {
    const result = await mainDb.client.createCollection(mainDb.collections.vendorProfiles, {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: [
                    "vendorId",
                    "name",
                    "contactNumber",
                    "contactEmailId",
                    "companyId",
                    "status",
                    "createdAt",
                    "lastModified"
                ],
                properties: {
                    vendorId: {
                        bsonType: "objectId",
                        description: "required"
                    },
                    name: {
                        bsonType: "string",
                        description: "required"
                    },
                    contactNumber: {
                        bsonType: "string",
                        description: "required"
                    },
                    contactEmailId: {
                        bsonType: "string",
                        description: "required"
                    },
                    createdAt: {
                        bsonType: "date",
                        description: "required"
                    },
                    lastModified: {
                        bsonType: "date",
                        description: "required"
                    },
                    companyId: {
                        bsonType: "objectId",
                        description: "required"
                    },
                    status: {
                        bsonType: "string",
                        description: "required"
                    }
                }
            }
        }
    })
    return result
}

async function createBuyers(mainDb) {
    var result = await mainDb.client.createCollection(mainDb.collections.buyers, {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["emailId", "passwordHash", "createdAt", "lastModified", "status", "companyId"],
                properties: {
                    emailId: {
                        bsonType: "string",
                        description: "required"
                    },
                    passwordHash: {
                        bsonType: "string",
                        description: "required"
                    },
                    companyId: {
                        bsonType: "objectId",
                        description: "required"
                    },
                    createdAt: {
                        bsonType: "date",
                        description: "required"
                    },
                    lastModified: {
                        bsonType: "date",
                        description: "required"
                    },
                    status: {
                        bsonType: "string",
                        description: "required"
                    }
                }
            }
        }
    })
    return result
}

async function createBuyerProfiles(mainDb) {
    const result = await mainDb.client.createCollection(mainDb.collections.buyerProfiles, {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: [
                    "buyerId",
                    "name",
                    "contactNumber",
                    "contactEmailId",
                    "companyId",
                    "status",
                    "createdAt",
                    "lastModified"
                ],
                properties: {
                    buyerId: {
                        bsonType: "objectId",
                        description: "required"
                    },
                    name: {
                        bsonType: "string",
                        description: "required"
                    },
                    contactNumber: {
                        bsonType: "string",
                        description: "required"
                    },
                    contactEmailId: {
                        bsonType: "string",
                        description: "required"
                    },
                    createdAt: {
                        bsonType: "date",
                        description: "required"
                    },
                    lastModified: {
                        bsonType: "date",
                        description: "required"
                    },
                    companyId: {
                        bsonType: "objectId",
                        description: "required"
                    },
                    status: {
                        bsonType: "string",
                        description: "required"
                    }
                }
            }
        }
    })
    return result
}

async function createVendorCategoryProducts(mainDb) {
    const result = await mainDb.client.createCollection(mainDb.collections.vendorCategoryProducts, {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: [
                    "vendorId",
                    "productsCategory",
                    "products",
                    "companyId",
                    "status",
                    "createdAt",
                    "lastModified"
                ],
                properties: {
                    vendorId: {
                        bsonType: "objectId",
                        description: "required"
                    },
                    productsCategory: {
                        bsonType: "string",
                        description: "required"
                    },
                    products: {
                        bsonType: "array",
                        description: "required"
                    },
                    createdAt: {
                        bsonType: "date",
                        description: "required"
                    },
                    lastModified: {
                        bsonType: "date",
                        description: "required"
                    },
                    companyId: {
                        bsonType: "objectId",
                        description: "required"
                    },
                    status: {
                        bsonType: "string",
                        description: "required"
                    }
                }
            }
        }
    })
    return result
}

async function createItemOrders(mainDb) {
    const result = await mainDb.client.createCollection(mainDb.collections.itemOrders, {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: [
                    "buyerId",
                    "buyerName",
                    "buyerRfqId",
                    "buyerPrId",
                    "buyerItemId",
                    "productName",
                    "productDescription",
                    "productParameters",
                    "quantity",
                    "unit",
                    "termsAndConditions",
                    "deliveryDays",
                    "buyerGroupId",
                    "companyId",
                    "companyName",
                    "companyCity",
                    "companyState",
                    "companyLocationCoordinates",
                    "companyCountry",
                    "createdAt",
                    "lastModified",
                    "status",
                    "productFile"
                ],
                properties: {
                    buyerId: {
                        bsonType: "objectId",
                        description: "required"
                    },
                    buyerName: {
                        bsonType: "string",
                        description: "required"
                    },
                    buyerRfqId: {
                        bsonType: "string",
                        description: "required"
                    },
                    buyerPrId: {
                        bsonType: "string",
                        description: "required"
                    },
                    buyerItemId: {
                        bsonType: "string",
                        description: "required"
                    },
                    productName: {
                        bsonType: "string",
                        description: "required"
                    },
                    productDescription: {
                        bsonType: "string",
                        description: "required"
                    },
                    productParameters: {
                        bsonType: "object",
                        description: "required"
                    },
                    quantity: {
                        bsonType: "double",
                        description: "required"
                    },
                    unit: {
                        bsonType: "string",
                        description: "required"
                    },
                    termsAndConditions: {
                        bsonType: "string",
                        description: "required"
                    },
                    deliveryDays: {
                        bsonType: "string",
                        description: "required"
                    },
                    buyerGroupId: {
                        bsonType: "string",
                        description: "required"
                    },
                    companyId: {
                        bsonType: "objectId",
                        description: "required"
                    },
                    companyName: {
                        bsonType: "string",
                        description: "required"
                    },
                    companyCity: {
                        bsonType: "string",
                        description: "required"
                    },
                    companyState: {
                        bsonType: "string",
                        description: "required"
                    },
                    companyLocationCoordinates: {
                        bsonType: "array",
                        description: "required"
                    },
                    companyCountry: {
                        bsonType: "string",
                        description: "required"
                    },
                    createdAt: {
                        bsonType: "date",
                        description: "required"
                    },
                    lastModified: {
                        bsonType: "date",
                        description: "required"
                    },
                    status: {
                        bsonType: "string",
                        description: "required"
                    },
                    productFile: {
                        bsonType: "string",
                        description: "required"
                    }
                }
            }
        }
    })
    return result
}

async function createVendorOrders(mainDb) {
    const result = await mainDb.client.createCollection(mainDb.collections.vendorOrders, {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: [
                    "vendorId",
                    "orderId",

                    //buyer's input
                    "productName",
                    "productDescription",
                    "productParameters",
                    "quantity",
                    "unit",
                    "termsAndConditions",
                    "deliveryDays",
                    "productFile",
                    "buyerId",
                    "buyerName",
                    "companyId",
                    "companyName",
                    "companyCity",
                    "companyState",
                    "companyLocationCoordinates",
                    "companyCountry",

                    //vendor's input
                    "quotedProductName",
                    "quotedProductDescription",
                    "quotedProductParameters",
                    "quotedPricePerUnit",
                    "quotedQuantity",
                    "quotedQuantityPrice",
                    "quotedUnit",
                    "quotedDiscount",
                    "quotedDeliveryCost",
                    "quotedLandingPrice",
                    "quotedPriceCurrency",
                    "quotedValidity",
                    "quotedDeliveryDays",
                    "quotedTermsAndConditions",
                    "quotedProductFile",
                    "status",
                    "vendorName",
                    //vendor's company
                    "vendorCompanyName",
                    "vendorCompanyId",
                    "vendorCompanyCity",
                    "vendorCompanyState",
                    "vendorCompanyLocationCoordinates",

                    "createdAt",
                    "lastModified"
                ],
                properties: {
                    vendorId: {
                        bsonType: "objectId",
                        description: "required"
                    },
                    orderId: {
                        bsonType: "objectId",
                        description: "required"
                    },

                    //product details from buyer
                    productName: {
                        bsonType: "string",
                        description: "required"
                    },
                    productDescription: {
                        bsonType: "string",
                        description: "required"
                    },
                    productParameters: {
                        bsonType: "object",
                        description: "required"
                    },
                    quantity: {
                        bsonType: "double",
                        description: "required"
                    },
                    unit: {
                        bsonType: "string",
                        description: "required"
                    },
                    termsAndConditions: {
                        bsonType: "string",
                        description: "required"
                    },
                    deliveryDays: {
                        bsonType: "string",
                        description: "required"
                    },
                    productFile: {
                        bsonType: "string",
                        description: "required"
                    },
                    buyerId: {
                        bsonType: "objectId",
                        description: "required"
                    },
                    buyerName: {
                        bsonType: "string",
                        description: "required"
                    },
                    companyId: {
                        bsonType: "objectId",
                        description: "required"
                    },
                    companyName: {
                        bsonType: "string",
                        description: "required"
                    },
                    companyCity: {
                        bsonType: "string",
                        description: "required"
                    },
                    companyState: {
                        bsonType: "string",
                        description: "required"
                    },
                    companyLocationCoordinates: {
                        bsonType: "array",
                        description: "required"
                    },
                    companyCountry: {
                        bsonType: "string",
                        description: "required"
                    },

                    //from vendor
                    quotedProductName: {
                        bsonType: "string",
                        description: "required"
                    },
                    quotedProductDescription: {
                        bsonType: "string",
                        description: "required"
                    },
                    quotedProductParameters: {
                        bsonType: "object",
                        description: "required"
                    },
                    quotedPricePerUnit: {
                        bsonType: "double",
                        description: "required"
                    },
                    quotedQuantityPrice: {
                        bsonType: "double",
                        description: "required"
                    },
                    quotedQuantity: {
                        bsonType: "double",
                        description: "required"
                    },
                    quotedUnit: {
                        bsonType: "string",
                        description: "required"
                    },
                    quotedDiscount: {
                        bsonType: "double",
                        description: "required"
                    },
                    quotedDeliveryCost: {
                        bsonType: "double",
                        description: "required"
                    },
                    quotedLandingPrice: {
                        bsonType: "double",
                        description: "required"
                    },
                    quotedPriceCurrency: {
                        bsonType: "string",
                        description: "required"
                    },
                    quotedValidity: {
                        bsonType: "double",
                        description: "required"
                    },
                    quotedDeliveryDays: {
                        bsonType: "string",
                        description: "required"
                    },
                    quotedTermsAndConditions: {
                        bsonType: "string",
                        description: "required"
                    },
                    quotedProductFile: {
                        bsonType: "string",
                        description: "required"
                    },
                    status: {
                        bsonType: "string",
                        description: "required"
                    },
                    vendorName: {
                        bsonType: "string",
                        description: "required"
                    },
                    //vendor's company
                    vendorCompanyName: {
                        bsonType: "string",
                        description: "required"
                    },
                    vendorCompanyId: {
                        bsonType: "objectId",
                        description: "required"
                    },
                    vendorCompanyCity: {
                        bsonType: "string",
                        description: "required"
                    },
                    vendorCompanyState: {
                        bsonType: "string",
                        description: "required"
                    },
                    vendorCompanyLocationCoordinates: {
                        bsonType: "array",
                        description: "required"
                    },

                    createdAt: {
                        bsonType: "date",
                        description: "required"
                    },
                    lastModified: {
                        bsonType: "date",
                        description: "required"
                    }
                }
            }
        }
    })
    return result
}

async function createPreferredVendors(mainDb) {
    var result = await mainDb.client.createCollection(mainDb.collections.preferredVendors, {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: [
                    "companyId",
                    "companyName",
                    "vendorCompanyId",
                    "vendorCompanyName",
                    "createdAt",
                    "lastModified",
                    "status"
                ],
                properties: {
                    companyId: {
                        bsonType: "objectId",
                        description: "required"
                    },
                    companyName: {
                        bsonType: "string",
                        description: "required"
                    },
                    vendorCompanyId: {
                        bsonType: "objectId",
                        description: "required"
                    },
                    vendorCompanyName: {
                        bsonType: "string",
                        description: "required"
                    },
                    createdAt: {
                        bsonType: "date",
                        description: "required"
                    },
                    lastModified: {
                        bsonType: "date",
                        description: "required"
                    },
                    status: {
                        bsonType: "string",
                        description: "required"
                    }
                }
            }
        }
    })
    return result
}

module.exports = {
    createCompanyProfiles,
    createCompanies,
    createVendors,
    createVendorProfiles,
    createBuyers,
    createBuyerProfiles,
    createVendorCategoryProducts,
    createItemOrders,
    createVendorOrders,
    createPreferredVendors
}

/** companyProfiles
        attributes:{
            -attributes:
                companyId
                name, 
                country, 
                city, 
                state 
                address, 
                description,
                locationCoordinates:{
                    le,
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

/** companies
        attributes:{
                emailId,
                passwordHash,               
                createdAt,
                lastModified,
                status{
                    ACTIVE
                    NOT_ACTIVE
                }
        }
         */

/** vendors
        attributes:{
                emailId,                        
                passwordHash,                                
                companyId,
                createdAt,
                lastModified,
                status{
                    ACTIVE
                    NOT_ACTIVE
                }
        }
         */

/** vendorProfiles
        attributes:{            
            -attributes:
                vendorId
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

/** buyers
        attributes:{
                emailId,
                passwordHash,                                
                companyId,
                createdAt,
                lastModified,
                status{
                    ACTIVE
                    NOT_ACTIVE
                }
        }
         */

/** buyerProfiles
        attributes:{
                buyerId            
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

/** vendorCategoryProducts
        attributes:{
                vendorId, 
                productsCategory,
                products,
                companyId,
                createdAt,
                lastModified,
                status{
                    ACTIVE,
                    NOT_ACTIVE
                }
        } 
         */

/** itemOrders
        attributes: 
            buyerId,
            buyerName,
            buyerRfqId
            buyerPrId
            buyerItemId
            productName
            productDescription
            productParameters{}
            quantity
            unit
            termsAndConditions ,
            deliveryDays
            buyerGroupId,
            
            companyId,
            companyName,
            companyCity,
            companyState,
            companyLocationCoordinates{},
            companyCountry

            createdAt,
            lastModified,
            status{
                ACTIVE,
                NOT_ACTIVE
            } 
                            
        } 
         */

/** vendorOrders
            vendorId, 
            orderId,  
              

            productName
            productDescription
            productParameters{}
            quantity
            unit
            termsAndConditions,
            buyerId
            companyId,
            companyName,
            companyCity,
            companyState,
            companyLocationCoordinates{},
            companyCountry


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

            vendorName
            vendorCompanyName
            vendorCompanyId,
            vendorCompanyCity
            vendorCompanyState,
            vendorCompanyLocationCoordinates{
                lat,
                lon
            }

            createdAt,
            lastModified
            

        } 
         */
