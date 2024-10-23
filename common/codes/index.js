module.exports = {
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
        message: 'Invalid input. Mandatory fields: givenName,gender,phone or email',
    },
    invalid_input_req_fields_missing2: {
        code: '425',
        message: 'Invalid input. If id is specified treeId must be specified as well (vice-vesa)',
    },
    invalid_input_req_fields_missing3: {
        code: '426',
        message: 'Invalid input. Mandatory fields: phone or email',
    },
}