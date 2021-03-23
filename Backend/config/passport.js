const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth2').Strategy;
const ZoomStrategy = require('@giorgosavgeris/passport-zoom-oauth2').Strategy;

require('dotenv').config();

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

// passport.use('google', new GoogleStrategy({
//   clientID: process.env.GOOGLE_ID,
//   clientSecret: process.env.GOOGLE_SECRET,
//   callbackURL: '/auth/google/callback',
//   proxy: true,
//   passReqToCallback: true
// }, (req, accessToken, refreshToken, profile, done) => {
//   const user = profile;

//   done(null, user);
// }));

passport.use('zoom', new ZoomStrategy({
  clientID: process.env.ZOOM_ID,
  clientSecret: process.env.ZOOM_SECRET,
  callbackURL: '/zoom/oauth/callback',
}, (accessToken, refreshToken, profile, done) => {
  const user = profile;

  done(null, user);
}));

module.exports = passport;