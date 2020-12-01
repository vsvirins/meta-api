import Router from 'express';
import jsonwebtoken from 'jsonwebtoken';
import passport from 'passport';

const router = Router();

/***
 * @name auth/login
 * Redirects to the login page.
 */
router.get('/login', (req, res) => {
  res.send('login screen');
});

/***
 * @name auth/logout
 * Sign out the user.
 *
 * @todo
 * Redirect to landing page and remove the JWT.
 */
router.get('/logout', (req, res) => {
  res.status(200).send('logout');
});

/***
 * @name auth/github
 * Authenticates the user via 3rd party OAuth service GitHub.
 * Redirects to /auth/github/callback.
 */
router.get('/github', passport.authenticate('github', {scope: ['user:email']}));

/***
 * @name auth/github/callback
 * Redirect route from /auth/github.
 * Callback that generates the access token.
 *
 * @var req.user
 * Contains the user profile information.
 *
 * @todo
 * Return a JWT cookie to the user.
 * Function to check if user exists/create a new user.
 */
router.get(
  '/github/callback',
  passport.authenticate('github', {failureRedirect: '/login'}),
  (req, res) => {
    // User.findOrCreate()
    const user = {id: 'uniqueMongoId'};

    const JWT = jsonwebtoken.sign(user.id, process.env.JWT_SECRET!);
    res.json({jwt: JWT});
  }
);

router.post('/testjwt', passport.authenticate('jwt', {session: false}), (req, res) => {
  console.log(req.body);
  res.send('Signed in');
});

export default router;
