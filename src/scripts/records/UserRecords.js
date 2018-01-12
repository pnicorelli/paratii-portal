/* @flow */

import { Record as ImmutableRecord } from 'immutable'
import Cookies from 'js-cookie'

class User extends ImmutableRecord({
  email: null,
  name: 'John Doe', // TODO
  isSigningUp: false,
  isLoggingIn: false,
  keepUrl: true,
  wallet: null
}) {
  email: string;
  name: string;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  keepUrl: boolean;
  wallet: Object;

  constructor (email?: string) {
    super({email: email})
  }

  static fromCookies () {
    const email = Cookies.get('email')
    if (email) {
      return new User(email)
    } else {
      return new User()
    }
  }
}

export default User
