import { connect } from 'react-redux'
import RequiresLogin from './RequiresLogin'

import Signup from 'components/Signup'

const mapStateToProps = () => ({})

const mapDispatchToProps = () => ({})

export default RequiresLogin(connect(mapStateToProps, mapDispatchToProps)(Signup), false)
