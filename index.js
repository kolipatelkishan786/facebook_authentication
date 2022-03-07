/*  EXPRESS */
const express = require('express');
const app = express();
const session = require('express-session');
const Strategy = require('passport-facebook');

app.set('view engine', 'ejs');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

app.get('/', function (req, res) {
    res.render('pages/auth');
});


const port = process.env.PORT || 5000;
app.listen(port, () => console.log('App listening on port ' + port));


let passport = require('passport');
let userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => {
    res.render('pages/success', {user: userProfile});
});
app.get('/error', (req, res) => res.send('error logging in'));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

/*  Facebook AUTH  */

passport.use(new Strategy({
        clientID: 'Your client ID',
        clientSecret: 'Your client Secret',
        callbackURL: 'http://localhost:5000/fb/auth/callback',
        profileFields: ['id', 'displayName','photos']
    },
    function (accessToken, refreshToken, profile, done) {
        console.log(accessToken, refreshToken, profile);
        userProfile = profile;
        return done(null, userProfile);
    }
));

app.get('/fb/auth', passport.authenticate('facebook'));


app.use('/failed/login', (req, res, next) => {
    res.send('login failed');
});


app.get('/fb/auth/callback', passport.authenticate('facebook', {failureRedirect: '/error'}),
    function (req, res) {
        // Successful authentication, redirect success.
        res.redirect('/success');
    });


app.use('/logout', (req, res, next) => {
    req.logout();
    console.log(req.isAuthenticated());
    res.send('user is logged out');
});
