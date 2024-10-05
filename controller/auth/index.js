class AuthController {
    constructor() {}
    isSessionValid(sid) {
        if(sid == undefined) {
            return false;
        }
        return true;
    }
}
module.exports = new AuthController();