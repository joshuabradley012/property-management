const cognitoConfig = {
  region: process.env.REGION,
  userPoolId: process.env.USER_POOL_ID,
  clientId: process.env.CLIENT_ID,
  identityPoolId: process.env.IDENTITY_POOL_ID,
}

export default cognitoConfig