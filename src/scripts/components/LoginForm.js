/* @flow */

import React, { Component } from 'react'
import SignForm from 'components/foundations/forms/SignForm'
import Button from 'components/foundations/Button'
import TextField from 'components/widgets/forms/TextField'

type Props = {
  onSubmit: () => void,
  onInputChange: (name: string, e: Object) => void,
  isLoggingIn: boolean
}

class LoginForm extends Component<Props, void> {
  render () {
    const { onSubmit, onInputChange } = this.props
    return (
      <SignForm onSubmit={onSubmit} data-test-id="login-form">
        <TextField
          type="text"
          onChange={e => onInputChange('email', e)}
          label="Email"
          margin="0 0 30px"
          disabled={this.props.isLoggingIn}
        />
        <TextField
          type="password"
          onChange={e => onInputChange('password', e)}
          label="Password"
          margin="0 0 30px"
          disabled={this.props.isLoggingIn}
        />
        <Button type="submit" disabled={this.props.isLoggingIn} purple>
          Log in
        </Button>
      </SignForm>
    )
  }
}

export default LoginForm
