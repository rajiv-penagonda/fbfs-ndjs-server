const util = require('../../common/util');
const codes = require('../../common/codes');
class AuthController {
    constructor() {}
    isSessionValid(sid) {
        if(util.isFilled(sid)) {
            return true;
        }
        return false;
    }
    getCreds(req) {
        let cred = req.get('Authorization');
        if(cred != undefined && cred != null && (typeof cred == 'string') && util.isFilled(cred)) {
            cred = cred.split('Basic ');
            if(cred.length == 2) {
                cred = cred[1].split(':');
                if(cred.length == 2 && util.isFilled(cred[0]) && util.isFilled(cred[1])) {
                    return {...codes.get('success'),username:cred[0],password:atob(cred[1])}
                }
            }
        }
        return {...codes.get('auth_header_missing')}
    }
}
module.exports = new AuthController();