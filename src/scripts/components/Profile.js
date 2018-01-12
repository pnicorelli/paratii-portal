import React, { Component } from 'react'
import Title from './foundations/Title'
import Label from './foundations/Label'
import Wrapper from './foundations/Wrapper'

import LogoutButton from 'containers/LogoutButtonContainer'

type Props = {
  user: {
    name: string,
    email: string,
    wallet: Object
  }
}

class Profile extends Component<Props, void> {
  render () {
    const {name, email, wallet} = this.props.user
    const address = wallet ? wallet[0].address : 'an address'
    const mnemonic = wallet ? wallet.getMnemonic() : 'an mnemonic'
    return (
      <Wrapper>
        <Title id='profile-name'>{name}</Title>
        <Label id='profile-email'>{email}</Label>
        <Label id='profile-address'>{address}</Label>
        <Label id='profile-mnemonic'>{mnemonic}</Label>
        <LogoutButton />
      </Wrapper>
    )
  }
}

export default Profile
