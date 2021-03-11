const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy(
    {
        clientID: '156647556766-3pcai34hl28jshggvp5l4mt5p2o9frde.apps.googleusercontent.com',
        clientSecret: 'qxiPWzzQb3KXbHblHkQ_rmA0',
        callbackURL: '/auth/google/callback',
        passReqToCallback: true,
    }, (req, accessToken, refreshToken, profile, done) => {
        console.log("profile: ", profile);
        const user = profile;

        done(null, user);
    }
));

module.exports = passport;