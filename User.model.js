const mongoose = require('mongoose')

var userSchema = new mongoose.Schema
({
	uname:
	{
		type: String,
		required: 'This field is required'
	},
	
	email:
	{
		type: String,
		required: 'This field is required'
	},
	
	password:
	{
		type: String,
		required: 'This field is required'
	},
	
	name:
	{
		type: String
	},
	
	surname:
	{
		type: String
	},
	
	IIN:
	{
		type: String,
		default: ""
	},
	
	vip:
	{
		type: Boolean,
		default: false
	},
	
	phone:
	{
		type: String,
		default: ""
	},
	
	requestIds:
	{
		type: Array
	},

	doctor:
		{
			type: Boolean
		},

	clients:
		{
			type: Array
		}
})

mongoose.model("User", userSchema)