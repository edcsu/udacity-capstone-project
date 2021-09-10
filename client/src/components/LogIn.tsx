import * as React from 'react'
import Auth from '../auth/Auth'
import { Header, Button } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <Header as='h1'>Sign in to your account</Header>
        <Header as='h4'>Share your thoughts past, today, tomorrow, and beyond.</Header>
        <Button onClick={this.onLogin} content='Login' icon="sign-in" labelPosition='right' size="huge" color="twitter">
        </Button>
      </div>
    )
  }
}
