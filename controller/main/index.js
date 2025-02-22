require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const logger = require('morgan');
const express = require('express');
const routeFactory = require('../../routes/');
const db = require('../../db/');
class MainController {
    startServer() {
        process.on('SIGINT', () => {
            store.close();
            console.log('Server shutting down, closed db connection');
            process.exit();
        });
        let app = express();
        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({extended:false}));
        routeFactory.initialize(app,{});
        let store = db.getInstance();
        if(process.argv.length >= 4) {
            store.authenticate().then((params)=>{
                db.initModel();
                console.log('db connection established');
                let port = process.env.PORT_NUMBER;
                const options = {
                    key: fs.readFileSync(path.join(__dirname,'../../cert/fbfs_key.pem')),
                    cert: fs.readFileSync(path.join(__dirname,'../../cert/fbfs_CA_signed.pem')),
                }
                try {
                    https.createServer(options, app).listen(port, ()=>{
                        console.log(`API Server started, listening on port ${port}`);
                    });
                }
                catch(e) {
                    console.log('Unable to start the API server - ' + e);
                    process.exit();
                }
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