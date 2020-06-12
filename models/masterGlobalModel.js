const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const schema = mongoose.Schema;

const masterGlobalIndex = new schema({
    title: {
        type: String
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    }
}, { timestamps: true })

masterGlobalIndex.plugin(mongoosePaginate)
module.exports = mongoose.model("masterGlobalIndex", masterGlobalIndex)

mongoose.model('masterGlobalIndex', masterGlobalIndex).find((error, result) => {
    if (error) {
        console.log("errorrr>>", error);
    }
    else if (result.length != 0) {
        console.log("Master global index already created");
    }
    else {
        let obj = {
            title: "Interests"
        };
        let obj2 = {
            title: "Business Category"
        };
        let obj3 = {
            title: "Sort Items"
        };
        let obj4 = {
            title: "Brands"
        };
        let obj5 = {
            title: "Category & Subcategory"
        };
        let obj6 = {
            title: "Department"
        };
        let obj7 = {
            title: "Designation"
        };
        let obj8 = {
            title: "Document Type"
        };
        let obj9 = {
            title: "User Roles"
        };
        mongoose.model('masterGlobalIndex', masterGlobalIndex).create(obj, obj2, obj3, obj4, obj5, obj6, obj7, obj8, obj9, (createErr, createResult) => {
            if (createErr) {
                console.log("Create ERrorrr", createErr);
            }
            else {
                console.log("Master global index created", createResult);
            }
        })
    }
})