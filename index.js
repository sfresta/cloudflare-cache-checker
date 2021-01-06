#!/usr/bin/env node

'use strict';

const express        = require('express');
const queue          = require('express-queue');
const bodyParser     = require("body-parser");
const request        = require('request');

const TIMEOUT        = 10000;
const PORT           = 6336;
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
            'url': url,
            'error': `Invalid URL`,
        }));

    }

});


async function check_cache(url, res) {

    request(
        url,
        { headers: { 'User-Agent': userAgent }},
        function(error, response) {

            if ( error || response.statusCode != 200 ) {

                if( error ) {

                    res.status(200).type('application/json').send(JSON.stringify({
                        'success': false,
                        'url': url,
                        'error': error,
                    }));

                }
                else {

                    res.status(200).type('application/json').send(JSON.stringify({
                        'success': false,
                        'url': url,
                        'error': "status code "+response.statusCode,
                    }));

                }

            }
            else if( response.headers['cf-cache-status'] == undefined ) {

                res.status(200).type('application/json').send(JSON.stringify({
                    'success': true,
                    'url': url,
                    'cache_status': 'cloudflare_not_detected',
                    'response_headers': response.headers,
                }));

            }
            else {

                res.status(200).type('application/json').send(JSON.stringify({
                    'success': true,
                    'url': url,
                    'cache_status': response.headers['cf-cache-status'],
                    'response_headers': response.headers,
                }));

            }

        }
    );

}