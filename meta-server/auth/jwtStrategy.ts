import passport from 'passport';
import JwtStrategy, {ExtractJwt} from 'passport-jwt';

/***
 * @name JwtStrategy.
 * Authorizes the user with JSON Web Token.
 * Used as a express middleware in routes with protected access.
 * @example
 * router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res) => {})
 *
 * @description
 * No session data is stored:
 * user recives the encoded access token from the OAuth callback,
 * containing the id tied to the user.
 * When a user tries to access a protected endpoint,
 * the strategy extracts the (if any) token from the Autorization
 * header in the request, decodes it with the key stored in the enviroment variable
 * JWT_SECRET and compares the containing id with the users id,
 * deciding wheter or not the user gets access.
 *
 * Tokens expires after xx min and are renewed with the refresh token.
 *
 * @todo
 * Refresh token function.
 * findOrCreate function.
 *
 * @function init()
 * When called, initializes the strategy and makes it accessable in the routes.
 *
 * @var options
 * Options for JwtStrategy.
 *
 * @var jwtFromRequest
 * Contains the function that extracts the JWT from the headers of a request,
 * @var secretOrKey
 * String containing the secret key for verifying the token's signature.
 * @var jwtUserId
 * Contains the extracted and decoded user id from the requests jwt.
 */

const jwtStrategy = {
  init: () => {
    let options: JwtStrategy.StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    };

    passport.use(
      new JwtStrategy.Strategy(options, (jwtUserId, done) => {
        console.log(jwtUserId);
        const authorizeUser = (usr: any) => usr == 'uniqueMongoId';
        // await User.exists({_id: jwtUserId})
        const userIsAuthorized = authorizeUser(jwtUserId);
        if (userIsAuthorized) {
          return done(null, jwtUserId);
        } else {
          return done(null, false);
        }
      })
    );
  },
};

export default jwtStrategy;
