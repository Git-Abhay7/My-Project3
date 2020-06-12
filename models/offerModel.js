const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const schema = mongoose.Schema;

const offerModel = new schema({
    promotionId: {
        type: schema.Types.ObjectId,
        ref: "promotion"
    },
    itemName: {
        type: String
    },
    categoryId: {
        type: String,
        ref: "masterList"
    },
    subCategoryId: {
        type: String,
        ref: "masterList"
    },
    brandId: {
        type: String,
        ref: "masterList"
    },
    offerImage: {
        type: String
    },
    discount: {
        type: String
    },
    aed: {
        type: String
    },
    oldPrice: {
        type: String
    },
    newPrice: {
        type: String
    },
    Buy: {
        type: String
    },
    Get: {
        type: String
    },
    otherItemDetails: {
        otherItemName: {
            type: String
        },
        category: {
            type: String
        },
        subCategory: {
            type: String
        },
        brand: {
            type: String
        },
        image: {
            type: String
        },
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    }
}, { timestamps: true })

offerModel.plugin(mongoosePaginate)
module.exports = mongoose.model("offer", offerModel)

