import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import {VerifyCallback} from 'passport-oauth2';

/***
 * @name GitHubStrategy
 * Authenticates the user with OAuth2 and
 * uses GitHub as the authentication server.
 * Used as a express middleware to login/signup the user.
 * @example
 * router.get('/github', passport.authenticate('github', {scope: ['user:email']}));
 *
 * @description
 * Retrives the user profile containing information such as full name, email(if public) and GitHub user id.
 *
 * @function done() - Callback
 * Returns the profile to the redirect route /auth/github/callback
 * where user verification/registration is handled.
 *
 * @todo
 * Profile information is later used to either
 * verify an existing user or to register a new. findOrCreate()
 */

const gitHubStrategy = {
  init: () => {
    passport.use(
      new GitHubStrategy.Strategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          callbackURL: process.env.GITHUB_CALLBACK_URL!,
        },
        (_accessToken: string, _refreshToken: string, profile: any, done: VerifyCallback) => {
          return done(null, profile);
        }
      )
    );
  },
};
export default gitHubStrategy;
