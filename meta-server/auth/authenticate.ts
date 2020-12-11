import Axios from 'axios';
import {NextFunction, Request, Response} from 'express';
import jsonwebtoken, {TokenExpiredError} from 'jsonwebtoken';

/***
 * @name authenticate
 * Authenticates the user with JSON Web Token.
 * Used as a express middleware in routes with protected access.
 * @example
 * router.get('/profile', authenticate, (req, res) => {})
 *
 * @description
 * User recives the encoded access & refresh tokens from the OAuth callback,
 * containing the id tied to the user. No session data is stored.
 * When a user tries to access a protected endpoint,
 * the middleware extracts the access token from the Autorization
 * header in the request, decodes it with the key stored in the enviroment variable
 * JWT_SECRET and compares the containing id with the users id,
 * deciding wheter or not the user gets access.
 *
 * Tokens expires after 15 minutes and are renewed with the refresh token.
 * If the token is expired, a request is sent to the auth server,
 * if the id matches the refresh token, a new access token is sent back in the response.
 *
 *
 * @var err: TokenExpiredError | JsonWebTokenError | NotBeforeError
 * Returns TokenExpiredError if the access token is expired, follwed by a request to the auth server
 * for a renewed access token.
 *
 * @var req.headers.authorization: string
 * Contains the access token.
 *
 * @var req.body.accessToken: string
 * Stores the access token from the authorization header for easy access in the route,
 * where it's returned in the response to the client.
 *
 * @var token: Token | null
 * Contains the decoded access token or null if there's and error.
 *
 * @todo
 * Embedd the refresh token more secure.
 *
 */

type Token = {
  id: number;
  iat: number;
  exp: number;
};

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization || !req.body.id || !req.body.refreshToken)
    return res.sendStatus(401);

  const id = req.body.id;
  const accessToken = req.headers.authorization.split(' ')[1];
  const refreshToken = req.body.refreshToken;

  jsonwebtoken.verify(accessToken, process.env.JWT_SECRET!, async (err, token: Token | any) => {
    try {
      if (token && token.id !== id) return res.sendStatus(401);

      if (err) {
        if (err instanceof TokenExpiredError) {
          const response = await Axios.post('http://auth-server:9090/refresh', {id, refreshToken});
          if (response.status !== 201) return res.sendStatus(response.status);
          req.body.accessToken = response.data;
          next();
        } else {
          return res.sendStatus(401);
        }
      }
      req.body.accessToken = accessToken;
      next();
    } catch (error) {
      console.error(error);
      res.sendStatus(401);
    }
  });
};

export default authenticate;
