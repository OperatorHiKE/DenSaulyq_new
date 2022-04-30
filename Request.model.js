const mongoose = require('mongoose')

var requestSchema = new mongoose.Schema
({
    id:
        {
            type: String
        },
    date:
        {
            type: String
        },
    placeId:
        {
            type: String
        }
})

mongoose.model("Request", requestSchema)