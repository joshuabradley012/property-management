import React, { Suspense, lazy, useState, useEffect } from 'react'
import * as AWS from 'aws-sdk/global'
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core'

const poolData = {
  UserPoolId: 'us-west-2_kZx878f6F',
  ClientId: '6ro6noqqq8ii91no1ca7ievio4',
}
const userPool = new CognitoUserPool(poolData)

const userData = {
  Username: 'admin',
  Pool: userPool,
}
const cognitoUser = new CognitoUser(userData)

const authenticationData = {
  Username: 'admin',
  Password: 'Abc123!!!',
}
const authenticationDetails = new AuthenticationDetails(authenticationData)

let sessionUserAttributes
cognitoUser.authenticateUser(authenticationDetails, {
  onSuccess: function(result) {
    const accessToken = result.getAccessToken().getJwtToken()
    AWS.config.region = 'us-west-2'
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-west-2:cc7fcfdc-d59c-47be-8c52-418861ecb948',
      Logins: {
        'cognito-idp.us-west-2.amazonaws.com/us-west-2_kZx878f6F': result.getIdToken().getJwtToken(),
      }
    })
    AWS.config.credentials.refresh(err => {
      if (err) console.error(err)
      else console.log('Successfully logged in')
    })
  },
  onFailure: function(err) {
    console.error(err.message || JSON.stringify(err))
  },
  newPasswordRequired: function(userAttributes, requiredAttributes) {
    console.log(userAttributes)
    delete userAttributes.email_verified
    sessionUserAttributes = userAttributes
    createNewPassword(userAttributes)
  },
})

const createNewPassword = (ua) => {
  cognitoUser.completeNewPasswordChallenge('Abc123!!!', ua, {
    onSuccess: function(result) {
      console.log(result)
    },
    onFailure: function(err) {
      console.error(err.message || JSON.stringify(err))
    },
  })
}

const LoginForm = () => {
  const handleNewPassword = (newPassword) => {
    cognitoUser.completeNewPasswordChallenge(newPassword, sessionUserAttributes)
  }

  return (
    <Container>
      <Box p={1.5} px={[0, 1.5]}>
        <Grid container spacing={3} justify="center">
          <Grid item style={{ maxWidth: 400 }}>
            <Paper variant="outlined">
              <Box p={4}>
                <Typography variant="h5" align="center" gutterBottom={true}>Log in</Typography>
                <Typography  align="center" gutterBottom={true}>to continue to your account</Typography>
                <form autoComplete="off">
                  <TextField id="username" label="Username" variant="outlined" fullWidth={true} margin="normal" />
                  <TextField id="password" label="Password" variant="outlined" fullWidth={true} margin="normal" />
                  <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary" fullWidth={true}>Log in</Button>
                  </Box>
                </form>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default LoginForm