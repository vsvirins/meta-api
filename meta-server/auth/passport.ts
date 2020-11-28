import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import JwtStrategy from 'passport-jwt';
import {VerifyCallback} from 'passport-oauth2';

// Initilizes the passport strategies.
export const passportSetup = () => {
  /***
   * @name GitHubStrategy
   * Authenticates the user via GitHub and recieves the user profile.
   *
   * @var done - Callback
   * Returns the profile to the redirect route /auth/github/callback
   * where user verification/registration is handled.
   *
   * @todo
   * Profile information is later used to either
   * verify an existing user or to register a new.
   */
  passport.use(
    new GitHubStrategy.Strategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: process.env.GITHUB_CALLBACK_URL!,
      },
      (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
        return done(null, profile);
      }
    )
  );

  /***
   * @name JwtStrategy.
   * Authorizes the user with JSON Web Token.
   * Used as a express middleware in routes with protected access.
   * No session data is stored,
   * users recives a cookie with the decoded token
   * containing information tied to the user.
   * Tokens expires after xx min and are renewed with the refresh token.
   *
   * @todo
   * Generate token function.
   * Send token in github callback.
   * Refresh token function.
   * authorizeUser function.
   */

  // Options for JwtStrategy, sets and returns the JWT, sets the secret key used to generate tokens.
  let options: JwtStrategy.StrategyOptions = {
    jwtFromRequest: req => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['jwt'];
      }
      return token;
    },
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    new JwtStrategy.Strategy(options, (jwt_payload, done) => {
      const authorizeUser = (usr: any) => true;
      const userIsAuthorized = authorizeUser(jwt_payload.data);
      if (userIsAuthorized) {
        return done(null, jwt_payload.data);
      } else {
        return done(null, false);
      }
    })
  );
};

// Functions needed to serialize and return the user profile from 3rd party OAuth services.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
