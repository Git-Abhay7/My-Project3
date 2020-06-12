const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const schema = mongoose.Schema;
var branchModel = new schema({
    vendorId: {
        type: schema.Types.ObjectId,
        ref: "users"
    },
    branchId: {
        type: String,
    },
    registrationDate: {
        type: String,
        default: Date.now()
    },
    branchName: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    mobileNumber: {
        type: String
    },
    telephone: {
        type: String
    },
    email: {
        type: String,
        lowercase: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    address: {
        type: String
    },
    poBox: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: [Number]
    },
    website: {
        type: String
    },
    licenseNumber: {
        type: String
    },
    licenseExpiry: {
        type: String
    },
    vatNumber: {
        type: String
    },
    vatExpiry: {
        type: String
    },
    businessCategory: {
        type: String
    },
    brands: {
        type: String
    },
    productCategories: {
        type: String
    },
    shopTimings: [
        {
            mon: {
                type: String,
            },
            tue: {
                type: String
            },
            wed: {
                type: String,
            },
            thu: {
                type: String
            },
            fri: {
                type: String,
            },
            sat: {
                type: String
            }
        }
    ],
    linkSocialAccounts: [
        {
            Type: {
                type: String
            },
            url: {
                type: String
            },
        }
    ],
    uploadDocs: [{
        docType: {
            type: String
        },
        docs: {
            type: String
        }
    }],
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    },


}, { timestamps: true });

branchModel.index({ location: "2dsphere" });
branchModel.plugin(mongoosePaginate);
branchModel. plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("branch", branchModel);