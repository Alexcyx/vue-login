const express = require('express');
const model = require('../db/db.js');
const router = express.Router();

const AddBook = (req, res) => {
    console.log(req.body);
    let book = new model.Books({
        user: req.body.user,
        name: req.body.name
    })

    model.Books.findOne({
        user: (book.user),
        name: (book.name)
    }, (err, doc) => {
        if (err) console.log(err);
        if (doc) {
            res.json({
                success: false
            })
        } else {
            book.save(err => {
                if (err) console.log(err);
                console.log('book saved successfully!');
                res.json({
                    success: true
                })
            })
        }
    })
}

const AllBooks = (req, res) => {
    model.Books.find({
        user: (req.body.user)
    }, (err, doc) => {
        if (err) console.log(err);
        console.log(doc);
        res.json(doc);
    })
}

const GetBook = (req, res) => {
    model.Books.findOne({
        _id: (req.body._id)
    }, (err, doc) => {
        if (err) console.log(err);
        res.json(doc);
    })
}

const DeleteBook = (req, res) => {
    let id = req.body._id;
    let flag = false;
    model.Books.findOneAndRemove({
        _id: (id)
    }, (err, doc) => {
        if (err) console.log(err);
        flag = true;
    })
    model.Problem.remove({
        collections: (id)
    }, (err, doc) => {
        if (err) console.log(err);
        res.json({
            success: flag && true
        })

    })
}

module.exports = (router) => {
    router.post('/addBook', AddBook),
    router.post('/allBooks', AllBooks),
    router.post('/getBook', GetBook),
    router.post('/deleteBook', DeleteBook)
}