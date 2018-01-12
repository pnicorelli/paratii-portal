/* @flow */

import { createAction } from 'redux-actions'
import Promise from 'bluebird'
import Cookies from 'js-cookie'

import { SIGNUP_REQUESTED, SIGNUP_SUCCESS, LOGIN_REQUESTED, LOGIN_SUCCESS, LOGOUT } from 'constants/ActionConstants'

import type { Dispatch } from 'redux'

const signupRequested = createAction(SIGNUP_REQUESTED)
const signupSuccess = createAction(SIGNUP_SUCCESS)
const loginRequested = createAction(LOGIN_REQUESTED)
const loginSuccess = createAction(LOGIN_SUCCESS)
const logoutAction = createAction(LOGOUT)

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const signup = (name: string, email: string, password: string) => (dispatch: Dispatch<*>) => {
  dispatch(signupRequested())
  sleep(200).then(() => {
    Cookies.set('email', email)
    Cookies.set('name', name)
    dispatch(signupSuccess({name, email}))
  })
}

export const login = (email: string, password: string) => (dispatch: Dispatch<*>) => {
  dispatch(loginRequested())
  sleep(200).then(() => {
    Cookies.set('email', email)
    dispatch(loginSuccess({email}))
  })
}

export const logout = () => (dispatch: Dispatch<*>) => {
  dispatch(logoutAction())
  Cookies.remove('email')
}
