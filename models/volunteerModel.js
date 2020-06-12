const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const schema = mongoose.Schema;

const volunteerModel = new schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String    
    },
    userType:{
       type:String
    },   
    fullName: {
        type: String
    },
    email: {
        type: String,
        lowercase: true
    },
    mobileNumber: {
        type: String
    },
    company: {
        type: String
    },
    city: {
        type: String
    },
    location: {
        type: String
    },
    myStrengths: [{
        sales: {
            type: Boolean,
            default: false
        },
        marketing: {
            type: Boolean,
            default: false
        },
        coding: {
            type: Boolean,
            default: false
        },
        designing: {
            type: Boolean,
            default: false
        },
        admin: {
            type: Boolean,
            default: false
        },
        paperWork: {
            type: Boolean,
            default: false
        },
        goodHandWork: {
            type: Boolean,
            default: false
        },
        creativeMind: {
            type: Boolean,
            default: false
        },
        teamLeader: {
            type: Boolean,
            default: false
        },
        goodOrganizer: {
            type: Boolean,
            default: false
        },
        haveMelodiousVoice: {
            type: Boolean,
            default: false
        },
        haveLoudVoice: {
            type: Boolean,
            default: false
        },
    }],

    volunteeredIn: [{
        event: {
            type: String
        },
        yearMonth: {
            type: String
        },
        anySpecifics: {
            type: String
        }

    }],
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    },

}, { timestamps: true })

volunteerModel.plugin(mongoosePaginate)
module.exports = mongoose.model("volunteer", volunteerModel)