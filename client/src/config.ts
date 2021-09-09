const apiId = '.....'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-p0z9cafx.us.auth0.com',      // Auth0 domain
  clientId: 'c8D7LqPqO1cd7BtL8x4vgkrkc6lPrMBV',           // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
