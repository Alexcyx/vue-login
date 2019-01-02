const express = require('express');
const model = require('../db/db.js');
const router = express.Router();

const AddProblem = (req, res) => {
    // console.log(req.body);
    let problem = new model.Problem({
        title: req.body.title,
        problem: req.body.problem,
        answer: req.body.answer,
        photo: req.body.photo,
        date: req.body.date,
        favourite: req.body.favourite,
        collections: req.body.collections
    })

    problem.save(err => {
        if (err) console.log(err);
        console.log('problem saved successfully!');
        res.json({
            success: true
        })
    })
}

const AllProblems = (req, res) => {
    console.log(req.body);
    model.Problem.find({
        collections: (req.body.collections),
    }, (err, doc) => {
        if (err) console.log(err);
        res.json(doc);
    })
}

const FilteredProblems = (req, res) => {
    console.log(req.body);
    model.Problem.find({
        collections: (req.body.collections),
        date: {
            $lte: new Date(req.body.date2),
            $gte: new Date(req.body.date1)
        }
    }, (err, doc) => {
        if (err) console.log(err);
        res.json(doc);
    })
}

const GetProblem = (req, res) => {
    // console.log(req.body)
    model.Problem.findOne({
        _id: (req.body._id)
    }, (err, doc) => {
        if (err) console.log(err);
        // console.log(doc);
        res.send(doc);
    })
}

const DeleteProblem = (req, res) => {
    model.Problem.findOneAndRemove({
        _id: (req.body._id)
    }, (err, doc) => {
        if (err) console.log(err);
        res.json({
            success: true
        });
    })
}

const EditProblem = (req, res) => {
    console.log(req.body);
    model.Problem.updateOne({
        _id: (req.body._id)
    }, {
        title: req.body.title,
        problem: req.body.problem,
        answer: req.body.answer,
        photo: req.body.photo,
        favourite: req.body.favourite,
        collections: req.body.collections
    }, (err, doc) => {
        if (err) console.log(err);
        res.json({
            success: true
        })
    })
}

const ChangeFavourite = (req, res) => {
    model.Problem.updateOne({
        _id: (req.body._id)
    }, {
        favourite: (req.body.favourite),
    }, (err, doc) => {
        if (err) console.log(err);
        res.json({
            success: true
        })
    })
}

module.exports = (router) => {
    router.post('/addProblem', AddProblem),
    router.post('/allProblems', AllProblems),
    router.post('/getProblem', GetProblem),
    router.post('/filteredProblems', FilteredProblems),
    router.post('/deleteProblem', DeleteProblem),
    router.post('/editProblem', EditProblem),
    router.post('/changeFavourite', ChangeFavourite)
}