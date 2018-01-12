import React, { Component } from 'react'
import SignupForm from 'components/SignupForm'

import { RootState } from 'types/ApplicationTypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { signup } from 'actions/UserActions'
import { getIsSigningUp } from 'selectors/index'

type Props = {
  isSigningUp: boolean,
  requestSignup: (name: string, email: string, password: string) => void
}

class SignupFormContainer extends Component<Props, void> {
  constructor (props) {
    super(props)
    this.state = {name: '', email: '', password: ''}
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange (input, e) {
    this.setState({
      [input]: e.target.value
    })
  };

  handleSubmit (e) {
    const { name, email, password } = this.state
    e.preventDefault()
    this.props.requestSignup(name, email, password)
  }

  render () {
    return (
      <SignupForm
        onSubmit={this.handleSubmit}
        onInputChange={this.handleInputChange}
      />
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  isSigningUp: getIsSigningUp(state)
})

const mapDispatchToProps = dispatch => ({
  requestSignup: bindActionCreators(signup, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SignupFormContainer)
