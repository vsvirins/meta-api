import passport from 'passport';
import github2 from 'passport-github2';
//os.getenv('CLIENT_ID') etc
import {VerifyCallback} from 'passport-oauth2';

const CLIENT_ID = 'client';
const CLIENT_SECRET = 'secret';
const CALLBACK_URL = 'http://localhost';

passport.use(
  new github2.Strategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
    },
    (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
      console.log(accessToken);

      //   User.findOrCreate({githubId: profile.id}, (err, user) => {
      //     return done(err, user);
      //   });
    }
  )
);
