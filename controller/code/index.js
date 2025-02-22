let db = require('../../db');
let Code = require('../../db/code');
let codes = require('../../common/codes');
let util = require('../../common/util');
let store = db.getInstance();
class CodeController {
    constructor() {}
    isInputValid(req,res,action) {
        if(req.body == null || req.body == undefined || !util.isFilled(req.body.username)) {
            res.status(400).json({...codes.get('invalid_input_req_username_missing')});
            return false;
        }
        if(action == 'verify' && !util.isFilled(req.body.code)) {
            res.status(400).json({...codes.get('invalid_input_req_code_missing')});
            return false;
        }
        return true;
    }
    generateCode(req) {
        let rand = Math.random();
        rand = (rand == 0 ? 1 : rand);
        let code = Math.ceil(rand * 10000);
        code = code == 0 ? 1 : code;
        return (code < 1000 ? Math.floor(10000 - code) : code);
    }
    sendVerificationCode(req,res) {
        if(this.isInputValid(req,res)) {
            const code = this.generateCode()
            Code.upsert({username:req.body.username,code:code}).then(()=>{
                console.log('### code: ' + code);
                res.json({...codes.get('success'),verificationCode:code});
            }).catch((e)=>{
                res.json({...codes.get('unexpected_failure'),reason:e});
            });
        }
    }
    verifyCode(req,res) {
        if(this.isInputValid(req,res,'verify')) {
            Code.findAll({where: {username: req.body.username}}).then((r)=>{
                if(r.length > 0 && r[0].code == req.body.code) {
                    res.json({...codes.get('success')});
                }
                else {
                    res.json({...codes.get('code_verification_failed')});
                }
            }).catch((e)=>{
                res.status(500).json({...codes.get('unexpected_failure'),reason:e});
            });
        }
    }
}
module.exports = new CodeController();