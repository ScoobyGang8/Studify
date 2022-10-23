require('dotenv').config();

/* eslint-disable indent */
module.exports = {
    JWTsecret: 'mysecret',
    baseURL: 'http://localhost:3000',
    oauth2Credentials: {
        client_id: process.env.OAUTH_CLIENT_ID,
        project_id: 'artful-zone-364600',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        redirect_uris: [
            'http://localhost:3000/oauth/redirect'
        ],
        javascript_origins: [
            'http://localhost:8080',
            'http://localhost:3000'
        ],
        scopes: [
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/documents'
        ],

    },

};