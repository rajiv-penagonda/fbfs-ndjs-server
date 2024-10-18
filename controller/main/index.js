require('dotenv').config();
var logger = require('morgan');
var express = require('express');
var routeFactory = require('../../routes/');
var db = require('../../db/');
class MainController {
    startServer() {
        let app = express();
        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({extended:false}));
        routeFactory.initialize(app,{});
        let store = db.getInstance();
        if(process.argv.length >= 4) {
            store.authenticate().then((params)=>{
                console.log('db connection established');
                process.on('SIGINT', () => {
                    store.close();
                    console.log('Server shutting down, closed db connection');
                    process.exit();
                });
                let port = process.env.PORT_NUMBER;
                app.listen(port, () => {
                    console.log(`API Server started, listening on port ${port}`);
                });
            }).catch((error)=>{
                console.log('Unable to start db: ' + error);
            });
        }
        else {
            console.log('Unable to start server. Please supply db username and password in arg');
        }
    }
}
module.exports = new MainController();