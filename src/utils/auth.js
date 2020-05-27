import * as AWS from 'aws-sdk/global'
import * as jwt from 'jsonwebtoken'
import * as jwkToPem from 'jwk-to-pem'
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from 'amazon-cognito-identity-js'
import jwks from '../jwks'
import cognitoConfig from '../cognitoConfig'
import useAuth from '../contexts/AuthContext'

const poolData = {
  UserPoolId: cognitoConfig.userPoolId,
  ClientId: cognitoConfig.clientId,
}
const userPool = new CognitoUserPool(poolData)

let cognitoUserAttributes
let currentUser = userPool.getCurrentUser()

const getIdToken = () => {
  if (!currentUser) return null
  return currentUser.getSession((err, session) => {
    if (err || !session.isValid()) return null
    else return session.getIdToken().getJwtToken()
  })
}

const getAccessToken = () => {
  if (!currentUser) return null
  return currentUser.getSession((err, session) => {
    if (err || !session.isValid()) return null
    else return session.getAccessToken().getJwtToken()
  })
}

const getTokenHeader = (token) => JSON.parse(atob(token.split('.')[0]))
const getTokenPayload = (token) => JSON.parse(atob(token.split('.')[1]))

const getMatchingJwk = (token, jwks) => {
  const tokenHeader = getTokenHeader(token)
  for (var i = 0; i < jwks.keys.length; i++) {
    if (tokenHeader.kid === jwks.keys[i].kid) return jwks.keys[i]
  }
}

const getVerifiedToken = (token, jwk) => {
  const tokenHeader = getTokenHeader(token)
  const pem = jwkToPem(jwk)
  return jwt.verify(token, pem, { algorithims: [tokenHeader.alg] }, (err, decodedToken) => {
    if (err) console.error(err)
    return decodedToken
  })
}

const isValidAccessToken = (verifiedAccessToken) => (
  verifiedAccessToken
  && verifiedAccessToken['exp'] < Date.now()
  && verifiedAccessToken['client_id'] === cognitoConfig.clientId
  && verifiedAccessToken['iss'] === 'https://cognito-idp.' + cognitoConfig.region + '.amazonaws.com/' + cognitoConfig.userPoolId
  && verifiedAccessToken['token_use'] === 'access'
)

const isAccessTokenValid = () => {
  const accessToken = getAccessToken()
  if (!accessToken) return false
  const jwk = getMatchingJwk(accessToken, jwks)
  const verifiedAccessToken = getVerifiedToken(accessToken, jwk)
  return isValidAccessToken(verifiedAccessToken)
}

const createCognitoUser = (username) => new CognitoUser({ Username: username, Pool: userPool })

const defaultUser = () => {
  if (currentUser) return currentUser
  else return createCognitoUser('')
}

const signOut = () => currentUser.signOut()

const authenticateUser = (username, password, callbacks = {}) => {
  const authenticationData = {
    Username: username,
    Password: password,
  }
  const authenticationDetails = new AuthenticationDetails(authenticationData)

  currentUser = createCognitoUser(username)

  currentUser.authenticateUser(authenticationDetails, {
    onSuccess: function(result) {
      const accessToken = result.getAccessToken().getJwtToken()
      AWS.config.region = cognitoConfig.region
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: cognitoConfig.identityPoolId,
        Logins: {
          ['cognito-idp.' + cognitoConfig.region + '.amazonaws.com/' + cognitoConfig.userPoolId]: result.getIdToken().getJwtToken(),
        }
      })
      AWS.config.credentials.clearCachedId()
      AWS.config.credentials.refresh(err => {
        if (err) console.error(err)
        else callbacks.success(currentUser)
      })
    },
    onFailure: function(err) {
      callbacks.failure(err)
    },
    newPasswordRequired: function(userAttributes, requiredAttributes) {
      delete userAttributes.email_verified
      cognitoUserAttributes = userAttributes
      callbacks.newPasswordRequired()
    },
  })
}

const completeNewPasswordChallenge = (newPassword, callbacks = {}) => {
  currentUser.completeNewPasswordChallenge(newPassword, cognitoUserAttributes, {
    onSuccess: function() {
      callbacks.success()
    },
    onFailure: function(err) {
      callbacks.failure(err)
    },
  })
}

const fetchData = (queryString, callback) => {
  fetch('https://6wpgd6fc9b.execute-api.us-west-2.amazonaws.com/staging/data?' + queryString, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getIdToken(),
    }
  })
  .then(response => response.json())
  .then(data => callback(data))
  .catch(err => console.error(err))
}

const postData = (queryString, data, callback) => {
  fetch('https://6wpgd6fc9b.execute-api.us-west-2.amazonaws.com/staging/data?' + queryString, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getIdToken(),
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => callback(data))
  .catch(err => console.error(err))
}

const deleteData = (queryString, data, callback) => {
  fetch('https://6wpgd6fc9b.execute-api.us-west-2.amazonaws.com/staging/data?' + queryString, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getIdToken(),
    },
  })
  .then(response => response.json())
  .then(data => callback(data))
  .catch(err => console.error(err))
}

export {
  authenticateUser,
  completeNewPasswordChallenge,
  defaultUser,
  deleteData,
  fetchData,
  getIdToken,
  isAccessTokenValid,
  postData,
  signOut,
}
