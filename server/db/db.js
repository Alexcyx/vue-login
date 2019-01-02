const mongoose = require('mongoose')
const config = require('config-lite')

// mongodb 连接🔗
mongoose.connect(config.mongodb, { useMongoClient: true })
// 此处防止 node.js - Mongoose: mpromise 错误
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connect error'))
db.once('open', function () {
	console.log('Mongodb started successfully')
})


var userSchema = mongoose.Schema({
	email: String,
	password: String,
	recheck: String,
	token: String,
	create_time: Date
})

var booksSchema = mongoose.Schema({
	user: String,
	name: String
})

var problemSchema = mongoose.Schema({
	title: String,
	collections: String,
	favourite: Boolean,
	problem: String,
	answer: String,
	date: Date,
	photo: String
})

var model = {
	// 在此处扩展 model，例如：
	// Article: mongoose.model('Article', articleSchema),
	User: mongoose.model('User', userSchema),
	Problem: mongoose.model('Problem', problemSchema),
	Books: mongoose.model('Books', booksSchema)
}

module.exports = model
