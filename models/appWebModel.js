const mongoose = require('mongoose');
const schema = mongoose.Schema;

var appWebModel = new schema(
    {
        language: {
            type: String
        },
        radius_of_search: {
            type: String
        },
        currency: {
            type: String,
          },
        status: {
            type: String,
            enum: ["ACTIVE", "BLOCK", "DELETE"],
            default: "ACTIVE"
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('appWeb', appWebModel);

mongoose.model('appWeb', appWebModel).find((error, result) => {
    if (result.length == 0) {
        let obj1 = {
            'language': "english",
            'radius_of_search': "500",
            'currency': 'rupees'

        };
     
        mongoose.model('appWeb', appWebModel).create(obj1,
            (error, success) => {
                if (error)
                    console.log("Error is" + error)
                else
                    console.log("default setting saved succesfully.", success);
            })
    }
});
