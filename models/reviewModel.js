const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const schema = mongoose.Schema;
const reviewModel = new schema({
    userId: {
        type: String,
        ref: "users"
    },
    offerId: {
        type: String,
        ref: "offer"
    },
    reviewBy: {
        type: String
    },
    reviewTo: {
        type: String
    },
    reviewItem: {
        type: String
    },
    reviewContent: {
        type: String
    },
    reviewRating: {
        type: String
    },
    editedBy: {
        type: String
    },
    video: {
        type: String
    },
    image: {
        type: String
    },
    respondBy: {
        type: String
    },
    response: {
        type: String
    },
    isResponse: {
        type: Boolean,
        default: false
    },
    comments: {
        type: String
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    }
}, { timestamps: true })
reviewModel.plugin(mongoosePaginate)
module.exports = mongoose.model("review", reviewModel)

