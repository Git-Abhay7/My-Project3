const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const schema = mongoose.Schema;

const contentGlobalIndex = new schema({
    title: {
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

contentGlobalIndex.plugin(mongoosePaginate)
module.exports = mongoose.model("contentGlobalIndex", contentGlobalIndex)

mongoose.model('contentGlobalIndex', contentGlobalIndex).find((error, result) => {
    if (error) {
        console.log("errorrr>>", error);
    }
    else if (result.length != 0) {
        console.log("Content global index already created");
    }
    else {
        let obj = {
            title: "Terms & Conditions",
            description: "These Terms and Conditions (Agreemen) governs the use of the services (Service) that are made available by Website.com Solutions Inc. These Terms and Conditions represent the whole agreement and understanding between Website.com and the individual or entity who subscribes to our service.PLEASE READ THIS AGREEMENT CAREFULLY. By submitting your application and by your use of the Service, you agree to comply with all of the terms and conditions set out in this Agreement. Website.com may terminate your account at any time, with or without notice, for conduct that is in breach of this Agreement, for conduct that Website.com believes is harmful to its business, or for conduct where the use of the Service is harmful to any other party."
        };
        let obj2 = {
            title: "Privacy Policy",
            description: "A privacy policy is a statement or a legal document (in privacy law) that discloses some or all of the ways a party gathers, uses, discloses, and manages a customer or client's data. It fulfills a legal requirement to protect a customer or client's privacy. Personal information can be anything that can be used to identify an individual, not limited to the person's name, address, date of birth, marital status, contact information, ID issue, and expiry date, financial records, credit information, medical history, where one travels, and intentions to acquire goods and services.[1] In the case of a business it is often a statement that declares a party's policy on how it collects, stores, and releases personal information it collects. It informs the client what specific information is collected, and whether it is kept confidential, shared with partners, or sold to other firms or enterprises.[2] Privacy policies typically represent a broader, more generalized treatment, as opposed to data use statements, which tend to be more detailed and specific."
        };
        let obj3 = {
            title: "About Us",
            description: "The about us page is commonly used by all types of businesses to give customers more insight into who is involved with a given business and exactly what it does. The history of a business is often provided, and the histories of the people in charge are usually expressed through short articles, usually accompanied by photographs."
        };
        let obj4 = {
            title: "Contracts and Agreements"
        };
        let obj5 = {
            title: "FAQs"
        };
        let obj6 = {
            title: "Media Center News"
        };
        let obj7 = {
            title: "Media Center Events"
        };
        let obj8 = {
            title: "Media Center  Photos"
        };
        let obj9 = {
            title: "Media Center Videos"
        };
        let obj10 = {
            title: "Social Media"
        };
        let obj11 = {
            title: "LOGO"
        };
        let obj12 = {
            title: "Splash Screens"
        };
        mongoose.model('contentGlobalIndex', contentGlobalIndex).create(obj, obj2, obj3, obj4, obj5, obj6, obj7, obj8, obj9, obj10, obj11, obj12, (createErr, createResult) => {
            if (createErr) {
                console.log("Create ERrorrr", createErr);
            }
            else {
                console.log("Content global index created", createResult);
            }
        })
    }
})