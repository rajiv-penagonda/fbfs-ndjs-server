require('dotenv').config();
var logger = require('morgan');
var express = require('express');
var routeFactory = require('../../routes/');
var cookieParser = require('cookie-parser');
class MainController {
    constructor() {}
    startServer() {
        var app = express();
        app.use(logger('dev'));
        app.use(cookieParser());
        app.use(express.json());
        let port = process.env.PORT_NUMBER;
        app.use(express.urlencoded({extended:false}));
        routeFactory.initialize(app,{});
        app.listen(port, () => {
            console.log('Server listening on port ${port}');
        });
    }
}
module.exports = new MainController();