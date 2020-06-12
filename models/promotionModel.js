const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const schema = mongoose.Schema;

const promotionModel = new schema({
    vendorId: {
        type: schema.Types.ObjectId,
        ref: "users"
    },
    promotionName: {
        type: String
    },
    vendorId: {
        type: schema.Types.ObjectId,
        ref: "users"
    },
    branches: [{
        type: String,
        ref: "branch"
    }],
    fromDate: {
        type: String
    },
    toDate: {
        type: String
    },
    occasion: {
        type: String
    },
    specialTermsConditions: {
        type: String
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    }
}, { timestamps: true })

promotionModel.plugin(mongoosePaginate)
module.exports = mongoose.model("promotion", promotionModel)

