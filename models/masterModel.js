const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const schema = mongoose.Schema;

const masterModel = new schema({
    type: {
        type: String
    },
    interestName: {
        type: String
    },
    businessCategoryName: {
        type: String
    },
    sortItem: {
        type: String
    },
    brandName: {
        type: String
    },
    categoryName: {
        type: String
    },
    subCategories: [{
        subCategoryName: {
            type: String
        },
        subCategoryStatus: {
            type: String,
            enum: ["ACTIVE", "DELETE"],
            default: "ACTIVE"
        },
    }],
    departmentName: {
        type: String
    },
    designation: {
        type: String
    },
    roleName: {
        type: String
    },
    rolePermission: [{
        dashboardYnot: {
            type: Boolean,
            default: false
        },
        consumers: {
            type: Boolean,
            default: false
        },
        vendors: {
            type: Boolean,
            default: false
        },
        promotions: {
            type: Boolean,
            default: false
        },
        reviews: {
            type: Boolean,
            default: false
        },
        notifications: {
            type: Boolean,
            default: false
        },
        contentManagement: {
            type: Boolean,
            default: false
        },
        masterList: {
            type: Boolean,
            default: false
        },
        appWebSettings: {
            type: Boolean,
            default: false
        },
        userActivityLog: {
            type: Boolean,
            default: false
        },
        myProfileYnot: {
            type: Boolean,
            default: false
        },
        usersAndRoles: {
            type: Boolean,
            default: false
        },
        reportsYnot: {
            type: Boolean,
            default: false
        },
        dashboardVendor: {
            type: Boolean,
            default: false
        },
        myProfileVendor: {
            type: Boolean,
            default: false
        },
        myBranches: {
            type: Boolean,
            default: false
        },
        myPromotions: {
            type: Boolean,
            default: false
        },
        myReviews: {
            type: Boolean,
            default: false
        },
        myUsers: {
            type: Boolean,
            default: false
        },
        reportsVendor: {
            type: Boolean,
            default: false
        },
    }],
    documentType: {
        type: String
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    }
}, { timestamps: true })

masterModel.plugin(mongoosePaginate)
module.exports = mongoose.model("masterList", masterModel)

