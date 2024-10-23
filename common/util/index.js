class Util {
    constructor() {}
    isFilled(param) {
        if(param == undefined || param == null || param.trim().length == 0) {
            return false;
        }
        return true;
    }
    ifNotFilled(param, alt) {
        return this.isFilled(param) ? param : alt;
    }
}
module.exports = new Util();