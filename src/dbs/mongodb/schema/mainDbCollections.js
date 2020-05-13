async function createCompanyProfiles(mainDb) {
    var result = await mainDb.client.createCollection(mainDb.collections.companyProfile, {
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
                required: ["email", "passwordHash", "createdAt", "lastModified", "status"],
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
                required: ["email", "passwordHash", "createdAt", "lastModified", "status", "companyId"],
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
                required: ["email", "passwordHash", "createdAt", "lastModified", "status", "companyId"],
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
                    "status"
                ],
                properties: {
                    buyerId: {
                        bsonType: "objectId",
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
                        bsonType: "decimal",
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
                        bsonType: "decimal",
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

                    "productName",
                    "productDescription",
                    "productParameters",
                    "quantity",
                    "unit",
                    "termsAndConditions",
                    "buyerId",

                    "quotedProductName",
                    "quotedProductDescription",
                    "quotedProductParameters",
                    "quotedPricePerUnit",
                    "quotedQuantity",
                    "quotedUnit",
                    "quotedDiscount",
                    "quotedDeliveryCost",
                    "quotedLandingPrice",
                    "quotedValidity",
                    "quotedDeliveryDays",
                    "status",
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
                        bsonType: "decimal",
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
                    buyerId: {
                        bsonType: "object",
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
                        bsonType: "string",
                        description: "required"
                    },
                    quotedPricePerUnit: {
                        bsonType: "string",
                        description: "required"
                    },
                    quotedQuantity: {
                        bsonType: "decimal",
                        description: "required"
                    },
                    quotedUnit: {
                        bsonType: "decimal",
                        description: "required"
                    },
                    quotedDiscount: {
                        bsonType: "decimal",
                        description: "required"
                    },
                    quotedDeliveryCost: {
                        bsonType: "decimal",
                        description: "required"
                    },
                    quotedLandingPrice: {
                        bsonType: "decimal",
                        description: "required"
                    },
                    quotedValidity: {
                        bsonType: "decimal",
                        description: "required"
                    },
                    quotedDeliveryDays: {
                        bsonType: "decimal",
                        description: "required"
                    },
                    status: {
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
                        bsonType: "string",
                        description: "required"
                    },
                    lastModified: {
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
    createVendorOrders
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
