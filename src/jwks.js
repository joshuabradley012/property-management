const jwks = {
    "keys": [
    {
        "alg": "RS256",
        "e": "AQAB",
        "kid": process.env.K1ID,
        "kty": "RSA",
        "n": process.env.K1N,
        "use": "sig"
    },
    {
        "alg": "RS256",
        "e": "AQAB",
        "kid": process.env.K2ID,
        "kty": "RSA",
        "n": process.env.K2N,
        "use": "sig"
    }]
}

export default jwks