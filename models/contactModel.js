const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var schema = mongoose.Schema;
var contactModel = new schema({
    userId: {
        type: schema.Types.ObjectId,
        ref: "user"
    },
    userName: {
        type: String,
    },
    email: {
        type: String,
    },
    mobileNumber: {
        type: String,
    },
    message: {
        type: String,
    },

    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    },
},
    {
        timestamps: true
    })

contactModel.plugin(mongoosePaginate);
module.exports = mongoose.model("contact", contactModel)