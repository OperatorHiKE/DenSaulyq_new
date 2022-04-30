const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/Users', {
	useNewUrlParser: true
},
err => {
	if (!err)
		console.log("Connection succeeded")
	else
		console.log("Error in connection " + err)
})

require('./User.model')
require('./Place.model')
require('./Request.model')

const User = mongoose.model('User')
const Place = mongoose.model('Place')
const Request = mongoose.model('Request')

var newUser = function(uname, email, password, name, surname, IIN, phone)
{
	var user = new User()
	user.uname = uname
	user.email = email
	user.password = password
	user.name = name
	user.surname = surname
	user.IIN = IIN
	user.phone = phone
	user.requestIds = []
	user.vip = false
	user.save((err, doc) =>
	{
		if (!err)
			console.log("User created! " + uname)
	})
}
var iinExist = function(iin, callback)
{
	User.find({"IIN": iin}, (err, result) =>
	{
		if (JSON.stringify(result).length > 2)
			return callback(1)
		else
			return callback(0)
	})
}
var userExist = function(uname, email, callback)
{
	User.find({"uname": uname}, (err, result) =>
	{
		if (JSON.stringify(result).length > 2)
			return callback(1)
		else
			User.find({"email": email}, (err, result) =>
        		{
                	if (JSON.stringify(result).length > 2)
                        	return callback(2)
			else
				return callback(0)
        		})
	})
}
var registerUser = function(uname, email, password, name, surname, IIN, phone, callback)
{
	userExist(uname, email, (exist) =>
	{
	if (exist == 0)
		newUser(uname, email, password, name, surname, IIN, phone)
	return callback(exist)
	})
}
var loginUser = function(loginOrEmail, password, callback)
{
	User.find({"uname": loginOrEmail}, (err, result) =>
        {
		var user = JSON.parse(JSON.stringify(result))
                if (user.length > 0)
                        if (user[0].password == password)
				return callback(user[0])
			else
				return callback(1)
		else
			User.find({"email": loginOrEmail}, (err, result) =>
        		{
				var user = JSON.parse(JSON.stringify(result))
                		if (user.length > 0)
                        		if (user[0].password == password)
                                		return callback(user[0])
                        		else
						return callback(1)
				else
					return callback(2)
        		})
       })
}
var getPlaces = function(callback)
{
	Place.find({}, (err, result) =>
	{
		return callback(JSON.parse(JSON.stringify(result)))
	})
}
var getUser = function(loginOrEmail, password, callback)
{
	User.find({ $or: [{uname: loginOrEmail}, {email: loginOrEmail}], password: password}, (err, result) =>
	{
		return callback(JSON.parse(JSON.stringify(result)))
	})
}
var changeIIN = function(iin, loginOrEmail, password, callback)
{
	userExist(loginOrEmail, loginOrEmail, (exist) =>
	{
		iinExist(iin.toString(), (exists) => {
			if (exists == 0) {
				User.updateOne({$or: [{uname: loginOrEmail}, {email: loginOrEmail}], password: password}, {
					$set: {
						"IIN": iin.toString()
					}
				}).then((obj) => {
					console.log('Updated - ' + obj);
				}).catch((err) => {
					console.log('Error: ' + err);
				})
			}
			console.log(exists)
			return callback(exists)
		})
	})
}
var changeEmail = function(email, loginOrEmail, password, callback)
{
	userExist(loginOrEmail, loginOrEmail, (exist) =>
	{
		if (exist != 0) {
			User.find({"email": email}, (err, result) => {
				if (JSON.stringify(result).length > 2)
					return callback(0)
				User.updateOne({$or: [{uname: loginOrEmail}, {email: loginOrEmail}], password: password}, {
					$set: {
						"email": email.toString()
					}
				}).then((obj) => {
					console.log('Updated - ' + obj);
				}).catch((err) => {
					console.log('Error: ' + err);
				})
				return callback(exist)
			})
		}
	})
}
var changePhone = function(phone, loginOrEmail, password, callback)
{
	userExist(loginOrEmail, loginOrEmail, (exist) =>
	{
		if (exist != 0) {
			User.updateOne({$or: [{uname: loginOrEmail}, {email: loginOrEmail}], password: password}, {
				$set: {
					"phone": phone.toString()
				}
			}).then((obj) => {
				console.log('Updated - ' + obj);
			}).catch((err) => {
				console.log('Error: ' + err);
			})
		}
		return callback(exist)
	})
}
var addRequest = function(date, placeId, loginOrEmail, password, callback)
{
	userExist(loginOrEmail, loginOrEmail, (exist) => {
		Request.find({}, (err, result) => {
			var res = JSON.parse(JSON.stringify(result))
			var request = new Request()
			request.id = res.length
			request.date = date
			request.placeId = placeId
			request.save((err, doc) => {
				if (!err)
					console.log("Request created! " + date)
			})
			if (exist != 0) {
				User.updateOne({$or: [{uname: loginOrEmail}, {email: loginOrEmail}], password: password}, {
					$push: {
						"requestIds": request.id
					}
				}).then((obj) => {
					console.log('Updated - ' + obj);
				}).catch((err) => {
					console.log('Error: ' + err);
				})
			}
			return callback(exist)
		})
	})
}

module.exports =
{
	newUser: newUser,
	userExist: userExist,
	iinExist: iinExist,
	registerUser: registerUser,
	loginUser: loginUser,
	getPlaces: getPlaces,
	getUser: getUser,
	changeIIN: changeIIN,
	changeEmail: changeEmail,
	changePhone: changePhone,
	addRequest: addRequest
}