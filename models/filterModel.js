const mongoose = require("mongoose")
const schema = mongoose.Schema
const mainfilter = new schema({
    userId: {
        type: schema.Types.ObjectId,
        ref: "users"
    },

    main: [
        {
            minDiscount: {
                type: Number
            },
            maxDiscount: {
                type: Number
            },
            minRadius: {
                type: Number
            },
            maxRadius: {
                type: Number
            },
            minPrice: {
                type: Number
            },
            maxPrice: {
                type: Number
            }
        }
    ],
    store: [
        {
            storeName: {
                type: String
            }
        }],
    brand: [{
        brandName: {
            type: String
        }
    }],
    category: [
        {
            categoryName: {
                type: String
            }
        }]

})
module.exports = mongoose.model('filter', mainfilter)
