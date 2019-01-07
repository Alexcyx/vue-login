const express = require('express')
const UserController = require('../controller/user.js')
const BooksController = require('../controller/books.js')
const ProblemController = require('../controller/problem.js')
const UploadController = require('../controller/upload.js')
const router = express.Router()

UserController(router);
BooksController(router);
ProblemController(router);
UploadController(router);

module.exports = router
