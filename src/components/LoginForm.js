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

const cognitoConfig = {
  region: 'us-west-2',
  userPoolId: 'us-west-2_Gy65rIyLG',
  clientId: '5mt1bto4eiqkbvgfqqcor9kug4',
  username: 'joshuabradley012@gmail.com',
  password: 'Abc123!!!',
  identityPoolId: 'us-west-2:cc7fcfdc-d59c-47be-8c52-418861ecb948',
}

const poolData = {
  UserPoolId: cognitoConfig.userPoolId,
  ClientId: cognitoConfig.clientId,
}
const userPool = new CognitoUserPool(poolData)

const loginKey = 'cognito-idp.us-west-2.amazonaws.com/' + cognitoConfig.userPoolId

const userData = {
  Username: cognitoConfig.username,
  Pool: userPool,
}
const cognitoUser = new CognitoUser(userData)

const authenticationData = {
  Username: cognitoConfig.username,
  Password: cognitoConfig.password,
}
const authenticationDetails = new AuthenticationDetails(authenticationData)

cognitoUser.authenticateUser(authenticationDetails, {
  onSuccess: function(result) {
    const accessToken = result.getAccessToken().getJwtToken()
    AWS.config.region = cognitoConfig.region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: cognitoConfig.identityPoolId,
      Logins: {
        [loginKey]: result.getIdToken().getJwtToken(),
      }
    })
    AWS.config.credentials.refresh(err => {
      if (err) console.error(err)
      else console.log('Successfully logged in')
    })
  },
  onFailure: function(err) {
    if (err.code === 'NotAuthorizedException') {
      console.error(JSON.stringify(err));
    } else {
      console.error(JSON.stringify(err));
    }
  },
  newPasswordRequired: function(userAttributes, requiredAttributes) {
    delete userAttributes.email_verified
    createNewPassword(userAttributes)
  },
})

const createNewPassword = (ua) => {
  cognitoUser.completeNewPasswordChallenge('Abc123!!!', ua, {
    onSuccess: function(result) {
      console.log(result)
    },
    onFailure: function(err) {
      console.error(JSON.stringify(err))
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
                  <TextField id="username" label="Email" variant="outlined" fullWidth={true} margin="normal" />
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