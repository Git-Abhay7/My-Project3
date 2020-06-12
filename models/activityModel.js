const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');
const schema = mongoose.Schema;
var activityModel = new schema({
    userId: {
        type: schema.Types.ObjectId,
        ref: "users"
    },
    userName: {
        type: String,
    },
    activity: {
        type: String
    },
    ipAddress: {
        type: String,
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    },


}, { timestamps: true });

activityModel.plugin(mongoosePaginate);
module.exports = mongoose.model("activity", activityModel);