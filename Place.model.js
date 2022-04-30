const mongoose = require('mongoose')

var placeSchema = new mongoose.Schema
({
    adress_saita:
        {
            type: String
        },

    naimenovanie_oganizacii:
        {
            type: String
        },

    adress:
        {
            type: String
        },

    id:
        {
            type: String
        },

    kontact_tel:
        {
            type: String
        },

    vremia_priema:
        {
            type: String
        }
})

mongoose.model("Place", placeSchema)