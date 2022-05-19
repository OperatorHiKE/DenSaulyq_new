const mongoose = require('mongoose')

var commentSchema = new mongoose.Schema
({
    user:
        {
            type: String
        },
    comment:
        {
            type: String
        }
})

mongoose.model("Comment", commentSchema)