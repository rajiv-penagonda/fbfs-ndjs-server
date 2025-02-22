let codes = require('../common/codes');
const auth = require('../controller/auth');
class RouteFactory {
    constructor() {}
    initialize(app, db) {
        app.use((err, req, res, next) => {
            if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
                return res.status(400).json({...codes.get('invalid_body')});
            }
            next();
        });
        app.use('/api/v0.1/', (req, res, next)=>{
            switch(req.path) {
                case '/code':
                case '/signin':
                case '/signup':
                case '/password':
                default:
                    /*
                     * These end-points do not need user authentication
                     */
                    next();
                break;
                case '/albums':
                case '/comments':
                case '/feed':
                case '/media':
                case '/moments':
                case '/people':
                case '/reactions':
                case '/nodes':
                case '/trees':
                case '/person':
                    if(!auth.isSessionValid(req.get('Authorization'))) {
                        res.status(401).json({...codes.get('session_expired')});
                    }
                    else {
                        next();
                    }
                break;
            }
        });
        app.use('/api/v0.1/code/', require('./code'));
        app.use('/api/v0.1/:tid/albums/', require('./albums'));
        app.use('/api/v0.1/:tid/comments/', require('./comments'));
        app.use('/api/v0.1/:tid/feed/', require('./feed'));
        app.use('/api/v0.1/:tid/media/', require('./media'));
        app.use('/api/v0.1/:tid/moments', require('./moments'));
        app.use('/api/v0.1/:tid/people/', require('./people'));
        app.use('/api/v0.1/:tid/person/', require('./person'));
        app.use('/api/v0.1/:tid/reactions/', require('./reactions'));
        app.use('/api/v0.1/:tid/nodes/', require('./nodes'));
        app.use('/api/v0.1/trees/', require('./trees'));
        app.use('/api/v0.1/signup/', require('./signup'));
        app.use(function(req, res, next) {
            res.status(404).json({...codes.get('unrecognized_endpoint')});
        });
    }
}
module.exports = new RouteFactory();