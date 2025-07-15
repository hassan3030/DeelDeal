export default {
  auth: {
    providers: [
      {
        driver: 'oauth2',
        id: 'google',
        name: 'Google',
        icon: 'google',
        url: 'https://accounts.google.com/o/oauth2/v2/auth',
        scope: 'openid email profile',
        access_url: 'https://oauth2.googleapis.com/token',
        profile_url: 'https://openidconnect.googleapis.com/v1/userinfo',
        authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
        response_type: 'code',
        grant_type: 'authorization_code',
        client_id: process.env.AUTH_GOOGLE_CLIENT_ID,
        client_secret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.AUTH_GOOGLE_REDIRECT_URI || `${process.env.PUBLIC_URL}/auth/login/google`,
        profile_map: {
          id: 'sub',
          email: 'email',
          first_name: 'given_name',
          last_name: 'family_name'
        }
      }
    ]
  }
};

