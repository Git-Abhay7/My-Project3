const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const schema = mongoose.Schema;

const contentModel = new schema({
    type: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    addedBy: {
        type: String
    },
    broadcastFrom: {
        type: String
    },
    broadcastTo: {
        type: String
    },
    document: {
        type: String
    },
    question: {
        type: String
    },
    answer: {
        type: String
    },
    image: {
        type: String
    },
    video: {
        type: String
    },
    productLogo: {
        type: String
    },
    socialSite: {
        type: String
    },
    url: {
        type: String
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    }
}, { timestamps: true })

contentModel.plugin(mongoosePaginate)
module.exports = mongoose.model("content", contentModel)

mongoose.model('content', contentModel).find((error, result) => {
    if (result.length == 0) {
        let obj1 = {
            'type': "LOGO",
            'productLogo': "https://res.cloudinary.com/dl2d0v5hy/image/upload/v1588165028/ny02e6utpmzjm1q93jp5.jpg"
        };
        let obj2 = {
            'type': "LOGO",
            'productLogo': "https://res.cloudinary.com/dl2d0v5hy/image/upload/v1588165028/ny02e6utpmzjm1q93jp5.jpg"
        };
        mongoose.model('content', contentModel).create(obj1, obj2, (createErr, createResult) => {
            if (createErr) {
                console.log("Create ERrorrr", createErr);
            }
            else {
                console.log("Product logo created", createResult);
            }
        })
    }
})

