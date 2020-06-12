const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const schema = mongoose.Schema;

const featureModel = new schema({
    featureName: {
        type: String
    },
    video: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    }
}, { timestamps: true })

featureModel.plugin(mongoosePaginate)
module.exports = mongoose.model("feature", featureModel)

