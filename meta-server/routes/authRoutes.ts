import Axios from 'axios'
import Router from 'express'
import passport from 'passport'
import authenticate from '../middleware/authenticate'

const router = Router()

/***
 * @name auth/login
 * Redirects to the login page.
 *
 * @todo
 * login page lol
 */
router.get('/login', (req, res) => {
  res.send('login screen')
})

/***
 * @name auth/logout
 * Sign out the user.
 * Creates a request to the auth server,
 * destroys user's refresh token.
 *
 * @todo
 * Redirect to landing page.
 */
router.delete('/logout', authenticate, async (req, res) => {
  try {
    const response = await Axios.delete('http://localhost:9090/logout', {
      data: {
        id: req.body.id,
      },
    })
    if (response.status !== 204) return res.sendStatus(500)
    res.sendStatus(204)
  } catch (error) {
    res.sendStatus(500)
  }
})

/***
 * @name auth/github
 * Authenticates the user via 3rd party OAuth service GitHub.
 * Redirects to /auth/github/callback.
 */
router.get('/github', passport.authenticate('github', {scope: ['user:email']}))

/***
 * @name auth/github/callback
 * Redirect route from /auth/github.
 * Checks if the user exists, otherwise creates a new user document
 * in the database.
 * Creates a request to the auth server:
 * creates an access token and a refresh token,
 * stores the refresh token tied to the user id in the auth database,
 * returns the tokens in the response.
 *
 * @var req.user
 * Contains the GitHub user information.
 *
 * @var response.data
 * Contains the Access Token and Refresh Token
 *
 * @todo
 * Function to check if user exists/create a new user.
 * Secure the refresh token in a 'safe cookie' (can't remeber what it's called)
 */
router.get(
  '/github/callback',
  passport.authenticate('github', {failureRedirect: '/login'}),
  async (req, res) => {
    try {
      // User.findOrCreate()
      // user.id
      const user = {id: '1234'}

      const response = await Axios.post('http://auth-server:9090/login', {id: user.id})
      if (response.status != 201) return res.sendStatus(401)
      const tokens = response.data

      res.status(201).json(tokens)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
)

router.post('/testjwt', authenticate, (req, res) => {
  console.log(req.body)
  res.send('Access approved')
})

export default router
