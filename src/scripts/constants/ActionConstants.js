/* @flow */

const createActionConstant = constant => `@@PARATII_PORTAL_${constant}`

export const VIDEO_DATA_LOADED = createActionConstant('VIDEO_DATA_LOADED')

/* Signup Actions */
export const SIGNUP_REQUESTED = createActionConstant('SIGNUP_REQUESTED')
export const SIGNUP_SUCCESS = createActionConstant('SIGNUP_SUCCESS')
export const SIGNUP_FAILURE = createActionConstant('SIGNUP_FAILURE')

/* Login Actions */
export const LOGIN_REQUESTED = createActionConstant('LOGIN_REQUESTED')
export const LOGIN_SUCCESS = createActionConstant('LOGIN_SUCCESS')
export const LOGIN_FAILURE = createActionConstant('LOGIN_FAILURE')
export const LOGOUT = createActionConstant('LOGOUT')
