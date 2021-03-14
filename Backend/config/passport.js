const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

require('dotenv').config();

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: '/auth/google/callback',
        passReqToCallback: true
    }, (req, accessToken, refreshToken, profile, done) => {
        console.log("profile: ", profile);
        const user = profile;

        done(null, user);
    }
));

module.exports = passport;