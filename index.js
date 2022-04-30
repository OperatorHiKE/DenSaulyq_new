const express    = require('express')
const path       = require('path')
const bodyParser = require('body-parser')
const cookie     = require('cookie-parser')
const ejs        = require('ejs')
const mongodb    = require('./mongodb.js')

global.TextEncoder = require("util").TextEncoder
global.TextDecoder = require("util").TextDecoder

const app = express()
const port = 3000

app.use(express.static('html'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookie())
app.set('view engine', 'ejs')

app.get('/', (req, res) =>
{
	let loginOrEmail = req.cookies.login
	let password = req.cookies.password
	mongodb.getUser(loginOrEmail, password, (user) => {
		mongodb.getPlaces((result) => {
			var adresses = []
			var Xs = []
			var Ys = []
			for (var i = 0; i < result.length; i++) {
				adresses.push(result[i].adress)
				Xs.push(result[i].x)
				Ys.push(result[i].y)
			}
			res.render(path.join(__dirname, 'html', 'index'),
				{
					user: user[0],
					adresses: adresses,
					coordsX: Xs,
					coordsY: Ys
				})
		})
	})
})
app.get('/index.css', (req, res) =>
{
  res.sendFile(path.join(__dirname, 'html', 'style', 'index.css'))
})
app.get('/login.css', (req, res) =>
{
	res.sendFile(path.join(__dirname, 'html', 'style', 'login.css'))
})
app.get('/help.css', (req, res) =>
{
	res.sendFile(path.join(__dirname, 'html', 'style', 'help.css'))
})
app.get('/profile.css', (req, res) =>
{
	res.sendFile(path.join(__dirname, 'html', 'style', 'profile.css'))
})
app.get('/login', (req, res) =>
{
	let loginOrEmail = req.cookies.login
	let password = req.cookies.password
	if (loginOrEmail === undefined || loginOrEmail == '-1') {
		res.sendFile(path.join(__dirname, 'html', 'login.html'))
	}
	else {
		mongodb.getUser(loginOrEmail, password, (result) => {
			res.render(path.join(__dirname, 'html', 'profile'),
				{
					user: result[0]
				})
		})
	}
})
app.get('/login.js', (req, res) =>
{
  res.sendFile(path.join(__dirname, 'html', 'script', 'login.js'))
})
app.get('/map.js', (req, res) =>
{
	res.sendFile(path.join(__dirname, 'html', 'script', 'map.js'))
})
app.get('/mongodb', (req, res) =>
{
	res.sendFile(path.join(__dirname, 'mongodb.js'))
})



app.post('/register', (req, res) =>
{
	var uname = req.body.uname
	let password = req.body.password
	let email = req.body.email
	let name = req.body.name
	let surname = req.body.surname
	let IIN = req.body.IIN
	let phone = req.body.phone
	mongodb.registerUser(uname, email, password, name, surname, IIN, phone, (exist) =>
	{
	switch(exist)
	{
	case 0:
        	res.redirect('/login')
		break

	case 1:
			res.send('1')
		break

	case 2:
			res.send('2')
		break
	}
	})
})
app.post('/login', (req, res) =>
{
	let loginOrEmail = req.body.loginOrEmail
	let password = req.body.password
	mongodb.loginUser(loginOrEmail, password, (result) =>
	{
	if (result == 1)
		res.send("l")
	else if (result == 2)
		res.send("r")
	else {
		res.cookie('login', loginOrEmail)
		res.cookie('password', password)
		res.redirect('/')
	}
	})
})
app.get('/signout', (req, res) =>
{
	res.cookie('login', -1)
	res.cookie('password', -1)
	res.redirect('/')
})
app.post('/addRequest', (req, res) =>
{
	let date = req.body.date
	let placeId = req.body.placeId
	mongodb.addRequest(date, placeId, req.cookies.login, req.cookies.password, (result) =>
	{
		res.redirect('/login')
	})
})
app.post('/changeUser', (req, res) =>
{
	let iin = req.body.iin
	let email = req.body.email
	let phone = req.body.phone
	if (iin) {
		mongodb.changeIIN(iin, req.cookies.login, req.cookies.password, (result) => {
			if (result == 0)
				res.redirect('/login')
			else
				res.send("1")
		})
	}
	if (email) {
		mongodb.changeEmail(email, req.cookies.login, req.cookies.password, (result) => {
			if (result != 0)
				res.redirect('/login')
			else
				res.send("1")
		})
	}
	if (phone) {
		mongodb.changePhone(phone, req.cookies.login, req.cookies.password, (result) => {
			if (result != 0)
				res.redirect('/login')
			else
				res.send("1")
		})
	}
})

app.listen(port, () =>
{
  console.log(port)
})
