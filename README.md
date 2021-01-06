# Cloudflare Cache Checker

This is a simple nodejs application to check if a Cloudflare cache is working or not for a specific URL.

To check the cache, just send a HTTP POST request to /check-cache passing the url argument. It returns a comprensible JSON response:

<code>{"success":true,"cache_status":"{CACHE_STATUS_DETECTED}","response_headers":"{RESPONSE_HEADERS}"}</code>

where <b>{CACHE_STATUS_DETECTED}</b> can be:

<ul>
<li><b>cloudflare_not_detected</b>: the response header cf-cache-status is missing</li>
<li><b>HIT</b>: page retrieved from Cloudflare cache</li>
<li><b>MISS</b>: page retrieved from original server and added to Cloudflare cache</li>
<li><b>BYPASS</b>: page retrieved from original server</li>
<li><b>EXPIRED</b>: page retrieved from original server and added to Cloudflare cache</li>
</ul>


If you pass an invalid URL as argument, the following JSON array is returned:

<code>{"success":false,"error":"{ERROR HERE}"}</code>

By default, this application is listen on port 6336.

Example: if you want to check if the Cloudflare cache is working for the URL https://example.com/my-page and this application is listening on localhost:6336, send a simple cURL request like this:

<code>curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "url=https://example.com/my-page" http://localhost:6336/check-cache</code>

# Installation

Just install all required modules using the command:

<i>npm install</i>

then start it using:

<i>nodejs index.js</i>

### Start in background

Edit cloudflare_cache_checker.service and replace the "{full path to cloudflare-cache-checker directory}" string with the full path to this directory on your server. Then follow the instuctions.