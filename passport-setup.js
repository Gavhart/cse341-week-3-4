const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user'); // Your user model

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/redirect'
  },
  function(accessToken, refreshToken, profile, done) {
    // Check if user already exists in your DB
    User.findOne({ googleId: profile.id }).then((currentUser) => {
      if (currentUser) {
        // already have the user
        done(null, currentUser);
      } else {
        // if not, create user in your DB
        new User({
          googleId: profile.id,
          username: profile.displayName,
          // other fields can be added here
        })
        .save()
        .then((newUser) => {
          done(null, newUser);
        });
      }
    });
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});