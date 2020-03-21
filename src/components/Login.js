import React, {
  Fragment,
  useState,
} from 'react'
import {
  useHistory,
} from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core'
import PasswordInput from './PasswordInput'
import {
  authenticateUser,
  completeNewPasswordChallenge,
} from '../utils/auth'
import useAuth from '../contexts/AuthContext'

const Login = ({ classes }) => {
  const auth = useAuth()
  const history = useHistory()

  const [loginError, setLoginError] = useState(false)
  const [errorLabel, setErrorLabel] = useState('')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [newPasswordRequired, setNewPasswordRequired] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  const handleUsernameChange = event => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleNewPasswordChange = event => {
    setNewPassword(event.target.value)
  }

  const handleLoginSuccess = user => {
    auth.setUser(user)
    auth.setLoginStatus()
    history.push('/')
  }

  const handleLoginFailure = err => {
    setLoginError(true)
    setErrorLabel(err.message || 'Something went wrong.')
  }

  const handleNewPasswordRequired = () => {
    setLoginError(false)
    setErrorLabel('')
    setNewPasswordRequired(true)
  }

  const handleNewPassword = event => {
    event.preventDefault()
    completeNewPasswordChallenge(newPassword, {
      success: handleLoginSuccess,
      failure: handleLoginFailure,
    })
  }

  const handleLoginSubmit = event => {
    event.preventDefault()
    authenticateUser(username, password, {
      success: handleLoginSuccess,
      failure: handleLoginFailure,
      newPasswordRequired: handleNewPasswordRequired,
    })
  }

  return (
    <Container className={classes.loginPage}>
      <Box p={1.5} px={[0, 1.5]}>
        <Grid container spacing={3} justify="center">
          <Grid item className={classes.loginForm}>
            <Paper variant="outlined">
              <Box p={4}>
                { newPasswordRequired ?
                  <Fragment>
                    <Typography variant="h5" align="center" gutterBottom={true}>Create new password</Typography>
                    <Typography  align="center" gutterBottom={true}>to enable your account</Typography>
                    <form autoComplete="off" onSubmit={handleNewPassword}>
                      <PasswordInput
                        id="new-password"
                        label="New Password"
                        variant="outlined"
                        fullWidth={true}
                        margin="normal"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        error={loginError}
                        helperText={errorLabel}
                      />
                      <Box mt={2}>
                        <Button type="submit" variant="contained" color="primary" fullWidth={true}>Create</Button>
                      </Box>
                    </form>
                  </Fragment>
                  :
                  <Fragment>
                    <Typography variant="h5" align="center" gutterBottom={true}>Log in</Typography>
                    <Typography  align="center" gutterBottom={true}>to continue to your account</Typography>
                    <form autoComplete="off" onSubmit={handleLoginSubmit}>
                      <TextField
                        id="username"
                        label="Email"
                        variant="outlined"
                        fullWidth={true}
                        margin="normal"
                        value={username}
                        onChange={handleUsernameChange}
                        error={loginError}
                      />
                      <PasswordInput
                        id="password"
                        label="Password"
                        variant="outlined"
                        fullWidth={true}
                        margin="normal"
                        value={password}
                        onChange={handlePasswordChange}
                        error={loginError}
                        helperText={errorLabel}
                      />
                      <Box mt={2}>
                        <Button type="submit" variant="contained" color="primary" fullWidth={true}>Log in</Button>
                      </Box>
                    </form>
                  </Fragment>
                }
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Login
