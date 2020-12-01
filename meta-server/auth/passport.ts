import passport from 'passport';
import gitHubStrategy from './gitHubStrategy';
import jwtStrategy from './jwtStrategy';

const passportSetup = {
  // Initilizes the passport strategies.
  init: () => {
    jwtStrategy.init();
    gitHubStrategy.init();
  },
};

// Functions needed to serialize and return the user profile from 3rd party OAuth services.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

export default passportSetup;
