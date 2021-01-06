#!/usr/bin/env node

'use strict';

const express        = require('express');
const queue          = require('express-queue');
const bodyParser     = require("body-parser");
const request        = require('request');

const PORT           = 6336;
const TIMEOUT        = 3000; // 3 secs
const app            = express();
const userAgent      = 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36';


// Using queue middleware
app.use(queue({ activeLimit: 5, queuedLimit: -1 }));
app.use(bodyParser.urlencoded({ extended: false }));


var server = app.listen(PORT, function() {
    console.log(`Cloudflare Cache Checker is listening on port ${PORT}`);
});

server.timeout = TIMEOUT;


// GET
app.get('/', async (req, res) => {
    res.status(200).send('It is a good day!');
});


// POST
// curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "url={URL TO CHECK}" http://localhost:6336/check-cache
app.post('/check-cache', async (req, res) => {

    // Input
    const url = req.body.url.toLowerCase() || false;


    if( url != false ) {
        check_cache( url, res );
    }
    else {

        return res.status(500).type('application/json').send(JSON.stringify({
            'success': false,
            'reason': `Invalid URL`,
        }));

    }

});


async function check_cache(url, res) {

    request(
        url,
        { headers: { 'User-Agent': userAgent }},
        function(error, response) {

            if( response.headers['cf-cache-status'] == undefined ) {

                res.status(200).type('application/json').send(JSON.stringify({
                    'success': true,
                    'cache_status': 'cloudflare_not_detected',
                    'response_headers': response.headers,
                }));

            }
            else {

                res.status(200).type('application/json').send(JSON.stringify({
                    'success': true,
                    'cache_status': response.headers['cf-cache-status'],
                    'response_headers': response.headers,
                }));

            }

        }
    );

}