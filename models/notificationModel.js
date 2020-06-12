const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const schema = mongoose.Schema;
const notificationModel = new schema({

    userId: {
        type: schema.Types.ObjectId,
        ref: "users"
    },
    medium: {
        isPushNotification: {
            type: Boolean,
            default: false
        },
        isOpportunityBar: {
            type: Boolean,
            default: false
        },
        isPopUpMessage: {
            type: Boolean,
            default: false
        },
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    frequency: {
        type: String,
        enum: ["Everyday", "Every week", "Every month", "Whenever open"]
    },
    frequencyTime: {
        type: String,
        enum: ["2 times", "3 times", "Whenever open"]
    },
    broadcastFrom: {
        type: String
    },
    broadcastTo: {
        type: String
    },
    sharedWith: {
        type: String,
        enum: ["All users", "All vendors", "All customers"]
    },
    condition: {
        type: String
    },
    linkTo: {
        type: String
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    }
}, { timestamps: true })

notificationModel.plugin(mongoosePaginate)
module.exports = mongoose.model("notification", notificationModel)

