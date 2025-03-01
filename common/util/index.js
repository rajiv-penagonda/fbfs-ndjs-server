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
    trim(param) {
        if(param == undefined || param == null) {
            return '';
        }
        if(typeof(param) == 'string') {
            return param.trim();
        }
        else {
            throw '[Util] param is not a string';
        }
    }
}
module.exports = new Util();