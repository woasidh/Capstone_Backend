const express = require('express');
const router = express.Router();
const request = require('request');
const passport = require('../config/passport');

const base64Encode = (plaintext) => {
    return Buffer.from(plaintext, "utf8").toString('base64');
}

router.get('/get', (req, res) => {
    // #swagger.tags = ['Zoom']
    // #swagger.path = '/zoom/get'
    const options = {
        url: 'https://api.zoom.us/v2/users',
        qs: {
            status: 'active'
        },
        headers: {
            authorization: `Bearer ${process.env.ZOOM_ZWT}`
        },
        headers: {
            'User-Agent': 'Zoom-Jwt-Request',
            'content-type': 'application/json'
        },
        json: true
    };
    request(options, (err, response)=> {
        if(err) {
            console.log('API call failed, reason', err);
            res.status(500).json(err);
        }
        else {
            console.log('User has', response);
            res.status(200).json(response);
        }
    });
});

router.get('/create/room', (req, res) => {
    // #swagger.tags = ['Zoom']
    // #swagger.path = '/zoom/create/room'
    const options = {
        url: 'https://api.zoom.us/v2/rooms',
        method: 'POST',
        headers: {
            authorization: `Bearer ${process.env.ZOOM_JWT}`
        },
        body: {
            "name": "Mingeon ZoomRoom",
            "type": "ZoomRoom"
        },
        json: true
    };
    request(options, (err, response)=> {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        }
        else {
            res.status(200).json(response);
        }
    })
});

// router.get('/oauth', passport.authenticate('zoom'));

// router.get('/oauth/callback', passport.authenticate('zoom'), (req,res)=>{
//     if(err) res.status(500).json(err);
//     else
//         res.status(200).json(req);
// });

router.get('/oauth', (req, res)=>{
    // #swagger.tags = ['Zoom']
    // #swagger.path = '/zoom/oauth'
    const url = 'https://zoom.us/oauth/authorize?'+
        'response_type=' + 'code' +
        '&client_id=' + process.env.ZOOM_ID +
        '&redirect_uri=' + 'http://localhost:3000/zoom/oauth/callback'
    res.redirect(url);
});

router.get('/oauth/callback', (req, res)=>{
    // #swagger.tags = ['Zoom']
    // #swagger.path = '/zoom/oauth/callback'
    const base64Secret = base64Encode(process.env.ZOOM_ID+":"+process.env.ZOOM_SECRET);
    const option = {
        url: 'https://zoom.us/oauth/token',
        method: 'POST',
        qs: {
            grant_type: 'authorization_code',
            code: req.query.code,
            redirect_uri: 'http://localhost:3000/zoom/oauth/callback'
        },
        headers: {
            authorization: `Basic ${base64Secret}`
        }
    }
    request(option, (err, response)=>{
        if(err) console.log(err);
        else {
            res.status(200);
            res.cookie('ZOOM', JSON.parse(response.body).access_token, {
                'httpOnly': false,
                'signed': false,
                'encode': String
            });
            res.json({ success : true });
        }
    });
});

module.exports = router;