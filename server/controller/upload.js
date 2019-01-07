const express = require('express');
const router = express.Router();
const formidable = require('formidable')
const fs = require('fs')

const Upload = (req, res) => {
    var form = new formidable.IncomingForm();
    var uploadfolderpath = './server/public/images';
    form.uploadDir = uploadfolderpath;
    form.parse(req, function(err, fields, files) {
        var file = files['uploadedFile'];
        var tempfilepath = file.path;
        var type = file.type;
        var filename = file.name;
        var extname = filename.lastIndexOf('.') >= 0
                        ? filename.slice(filename.lastIndexOf('.') - filename.length)
                        : '';
        if (extname === '' && type.indexOf('/') >= 0) {
            extname = '.' + type.split('/')[1];
        }
        filename = Math.random().toString().slice(2) + extname;
        var filenewpath = uploadfolderpath + '/' + filename;
        fs.rename(tempfilepath, filenewpath, function (err) {
            var result = '';
            var imgUrl = '';
            if (err) {
                console.log('fs.rename err');
                result = {
                    errno: 1,
                    data: []
                };
            } else {
                console.log('fs.rename done');
                imgUrl = 'http://localhost:' + 3000 + '/images/' + filename;
                result = {
                    errno: 0,
                    data: [imgUrl]
                };
            }
            res.send(result);
        });
    })
}

module.exports = (router) => {
    router.post('/upload', Upload)
}