const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const bcrypt = require("bcrypt-nodejs");
const schema = mongoose.Schema;
var userModel = new schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    fullName: {
        type: String
    },
    userName: {
        type: String
    },
    email: {
        type: String,
        lowercase: true
    },
    mobileNumber: {
        type: String
    },
    smartList: [
        {
            items: {
                type: String
            }
        }
    ],

    consumerId: {
        type: String
    },
    registrationDate: {
        type: String
    },
    telephone: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE", "OTHERS"]
    },
    nationality: {
        type: String
    },
    language: {
        type: String,
        default: "English"
    },

    myLocations: [{
        type: {
            type: String,
            default: "Point"
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
        name: {
            type: String
        },
        isMarked: {
            type: Boolean,
            default: false
        },
        coordinates: [Number]


    }],

    myInterests: [{
        interest: {
            type: String
        }
    }],
    mySocialAccounts: [{
        Type: {
            type: String
        },
        url: {
            type: String
        }
    }],
    education: {
        type: String
    },
    university: {
        type: String
    },
    relationshipStatus: {
        type: String
    },
    spouseName: {
        type: String
    },
    spouseMobile: {
        type: String
    },
    spouseEmail: {
        type: String
    },
    skills: {
        type: String
    },
    accomplishment: {
        type: String
    },
    groups: {
        type: String
    },
    friends: [{
        friendName: {
            type: String
        },
        friendMobile: {
            type: String
        },
        friendEmail: {
            type: String
        }
    }],
    validIdType: {
        type: String
    },
    idNumber: {
        type: String
    },
    idExpiry: {
        type: String
    },
    myAlerts: [{
        alert: {
            type: String
        }
    }],
    myFavourites: [{
        favourites: {
            type: String,
            ref: "offer"
        }
    }],
    myList: {
        type: String
    },
    cardsHolder: [{
        frontSide: {
            type: String
        },
        backSide: {
            type: String
        }
    }],
    specialComments: {
        type: String
    },
    uploadDocs: [{
        docType: {
            type: String
        },
        docs: {
            type: String
        }
    }],
    employeeId: {
        type: String
    },
    designation: {
        type: String
    },
    department: {
        type: String
    },
    company: {
        type: String
    },
    branch: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    password: {
        type: String
    },
    assignRole: {
        type: String
    },
    otp: {
        type: String
    },
    otpTime: {
        type: Number,
        default: Date.now()
    },
    otpVerification: {
        type: Boolean,
        default: false
    },
    profilePic: {
        type: String
    },
    businessId: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
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
    shopTimings: [{
        sun: {
            type: String
        },
        mon: {
            type: String
        },
        tue: {
            type: String
        },
        wed: {
            type: String
        },
        thu: {
            type: String
        },
        fri: {
            type: String
        },
        sat: {
            type: String
        }
    }],
    featureName: {
        type: String
    },
    vendorId: {
        type: schema.Types.ObjectId,
        ref: "users"
    },
    userType: {
        type: String,
        enum: ["ADMIN", "USER", "VENDOR", "SUBADMIN", "VOLUNTEER"],
        default: "USER",
        uppercase: true
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    },



}, { timestamps: true });

userModel.index({ myLocations: "2dsphere" });
userModel.plugin(mongoosePaginate);
userModel.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("users", userModel);

mongoose.model("users", userModel).find({ userType: "ADMIN" }, (err, result) => {
    if (err) {
        console.log("DEFAULT ADMIN ERROR", err);
    } else if (result.length != 0) {
        console.log("Default Admin.");
    } else {
        let obj = {
            userType: "ADMIN",
            firstName: "Tanya",
            lastName: "Chandwani",
            mobileNumber: "8400728210",
            email: "no-tanyachandwani@mobiloitte.com",
            password: bcrypt.hashSync("Mobiloitte1")

        };
        mongoose.model("users", userModel).create(obj, (err1, result1) => {
            if (err1) {
                console.log("DEFAULT ADMIN  creation ERROR", err1);
            } else {
                console.log("DEFAULT ADMIN Created", result1);
            }
        });
    }
});