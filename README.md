# Cloudflare Cache Checker

This is a simple nodejs application to check if a Cloudflare cache is working or not for a specific URL.

To check the cache, just send a HTTP POST request to /check-cache passing the url argument. It returns a comprensible JSON response

By default, this application is listen on port 6336.

Example: if you want to check if the Cloudflare cache is working for the URL https://example.com/my-page and this application is listening on localhost:6336, send a simple cURL request like this:

curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "url=https://example.com/my-page" http://localhost:6336/check-cache

# Installation

Just install all required modules using the command:

npm install

then start it using:

nodejs index.js

### Start in background

Edit cloudflare_cache_checker.service and replace the "{full path to cloudflare-cache-checker directory}" string with the full path to this directory on your server. Then follow the instuctions.