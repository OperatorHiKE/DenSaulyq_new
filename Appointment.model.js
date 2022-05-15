const mongoose = require('mongoose')

var appointmentSchema = new mongoose.Schema
({
    department:
        {
            type: String
        },
    doctor:
        {
            type: String
        },
    date:
        {
            type: Date
        },
    time:
        {
            type: String
        },
    name:
        {
            type: String
        },
    phone:
        {
            type: String
        },
    message:
        {
            type: String
        }
})

mongoose.model("Appointment", appointmentSchema)