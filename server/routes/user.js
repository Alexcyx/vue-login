const express = require('express')
const UserController = require('../controller/user.js')
const BooksController = require('../controller/books.js')
const ProblemController = require('../controller/problem.js')
const router = express.Router()

UserController(router);
BooksController(router);
ProblemController(router);

module.exports = router
