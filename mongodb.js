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
require('./Appointment.model')
require('./Comment.model')

const User = mongoose.model('User')
const Place = mongoose.model('Place')
const Request = mongoose.model('Request')
const Appointment = mongoose.model('Appointment')
const Comment = mongoose.model('Comment')

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
var getUserAsync = async function (loginOrEmail, password) {
	const callback = await User.find({$or: [{uname: loginOrEmail}, {email: loginOrEmail}], password: password}).lean()
	return callback
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

var getDoctors = function(callback)
{
	User.find({ doctor: true }, (err, result) =>
	{
		return callback(JSON.parse(JSON.stringify(result)))
	})
}

var newClient = function(uname, doctor, isFirst, callback)
{
	console.log(isFirst)
	if (isFirst == 'true') {
		console.log(1)
		User.updateOne({uname: doctor},
			{
				$push: {
					clients: uname
				}
			}, (err, result) => {
				return callback()
			})
	} else {
		return callback()
	}
}

var makeAppointment = function(department, doctor, date, time, name, phone, message, callback)
{
	Appointment.create
	({
		department,
		doctor,
		date,
		time,
		name,
		phone,
		message
	}).then()
	return callback();
}

var getAppointments = async function(sortBy)
{
	var callback = 0
	switch (sortBy) {
		case 'department':
			callback = Appointment.find({}).sort({department: 1}).lean()
			break;

		case 'doctor':
			callback = Appointment.find({}).sort({doctor: 1}).lean()
			break;

		case 'date':
			callback = Appointment.find({}).sort({date: 1}).lean()
			break;

		case 'time':
			callback = Appointment.find({}).sort({time: 1}).lean()
			break;

		case 'name':
			callback = Appointment.find({}).sort({name: 1}).lean()
			break;

		case 'phone':
			callback = Appointment.find({}).sort({phone: 1}).lean()
			break;

		case 'message':
			callback = Appointment.find({}).sort({message: 1}).lean()
			break;
	}
	if (callback == 0)
		callback = Appointment.find({}).lean()
	return callback
}

var changeAppointment = function(department, doctor, date, time, name, phone, message, id)
{
	Appointment.updateOne({ _id: id }, {
		$set: {
			"department": department,
			"doctor": doctor,
			"date": date,
			"time": time,
			"name": name,
			"phone": phone,
			"message": message,
		}
	}).then()
}

var deleteAppointment = function(id)
{
	Appointment.deleteOne({ _id: id }).then()
}

var deleteClientChat = function(loginOrEmail, client)
{
	User.updateOne({$or: [{uname: loginOrEmail}, {email: loginOrEmail}]}, {
		$pull: {
			"clients": client
		}
	}).then()
}

var createComment = function (user, comment, callback)
{
	Comment.create
	({
		user,
		comment
	}).then()
	return callback;
}

var getComment = function(loginOrEmail, callback) {
	Comment.find({}, (err, result) => {
		return callback(JSON.parse(JSON.stringify(result)))
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
		getUserAsync: getUserAsync,
		changeIIN: changeIIN,
		changeEmail: changeEmail,
		changePhone: changePhone,
		addRequest: addRequest,
		getDoctors: getDoctors,
		newClient: newClient,
		makeAppointment: makeAppointment,
		changeAppointment: changeAppointment,
		deleteAppointment: deleteAppointment,
		getAppointments: getAppointments,
		deleteClientChat: deleteClientChat,
		createComment: createComment,
		getComment: getComment
	}
