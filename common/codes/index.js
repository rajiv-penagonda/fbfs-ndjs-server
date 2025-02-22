const codesJSON = {
    success: {
        code: '100',
        message: "Operation successful.",
    },
    session_expired: {
        code: '107',
        message: "Auth failed - Session is invalid or user has logged out.",
    },
    invalid_body: {
        code: '400',
        message: "Request body is invalid",
    },
    unrecognized_endpoint: {
        code: '108',
        message: "Aarg! no man's land",
    },
    unexpected_failure: {
        code: '419',
        message: 'Unexpected system failure. Please contact support - ',
    },
    dupe_user: {
        code: '420',
        message: 'Duplicate user found',
    },
    dupe_user_chk_pass: {
        code: '421',
        message: 'Username is not registered; no invite found.',
    },
    dupe_user_chk_pass_with_invite: {
        code: '422',
        message: 'Username is not registered; Invite found.',
    },
    invalid_input_person_missing: {
        code: '423',
        message: 'Invalid input. Person data missing in request body.',
    },
    invalid_input_req_fields_missing1: {
        code: '424',
        message: 'Invalid input. Mandatory fields: username,password,givenName,gender,phone or email',
    },
    invalid_input_req_fields_missing3: {
        code: '425',
        message: 'Invalid input. Mandatory fields: phone or email',
    },
    signup_success: {
        code: '426',
        message: 'Signup completed successfully.',
    },
    invalid_input_req_username_missing: {
        code: '427',
        message: 'Invalid input. Mandatory fields: username',
    },
    invalid_input_req_code_missing: {
        code: '427',
        message: 'Invalid input. Mandatory fields: username,code',
    },
    code_verification_failed: {
        code: '429',
        message: 'Code verification failed',
    },
    auth_header_missing: {
        code: '430',
        message: 'Authorization header parameter is missing or does not have creds in it.',
    },
}
class Codes {
    static _codeMap;
    static get(key) {
        if(!this._codeMap) {
            this._codeMap = new Map(Object.entries(codesJSON));
        }
        return this._codeMap.get(key);
    }
}
module.exports = Codes;