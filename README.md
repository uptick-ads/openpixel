# Openpixel
<a href="https://www.npmjs.com/package/openpixel"><img src="https://img.shields.io/npm/v/openpixel.svg" /></a>
<a href="https://www.npmjs.com/package/openpixel"><img src="https://img.shields.io/npm/dt/openpixel.svg" /></a>

[![Powered by Dockwa](https://raw.githubusercontent.com/dockwa/openpixel/dockwa/by-dockwa.png)](https://engineering.dockwa.com/)

## About
Openpixel is a customizable JavaScript library for building tracking pixels. Openpixel sends each event as a web beacon (`navigator.sendBeacon`), a POST to the pixel endpoint. When the beacon is unavailable or the browser declines to queue it, it falls back to a keepalive `fetch` POST; the endpoint does not accept GET requests.

At Dockwa we built openpixel to solve our own problems of implementing a tracking service that our marinas could put on their website to track traffic and attribution to the reservations coming through our platform.

Openpixel handles the hard things about building a tracking library so you don't have to. It handles things like tracking unique users with cookies, tracking utm tags and persisting them to that users session, getting all of the information about the clients browser and device, and many other neat tricks for performant and accurate analytics.

Openpixel has two parts, the snippet (`snippet.html`), and the core (`openpixel.min.js`).

### Snippet
The openpixel snippet (found at `dist/snippet.html`) is the HTML code that will be put onto any webpage that will be reporting analytics. For Dockwa, our marina websites put this on every page of their website so that it would load the JS to execute beacons back to a tracking server. The snippet can be placed anywhere on the page and it will load the core openpixel JS asynchronously. To be accurate, the first part of the snippet gets the timestamp as soon as it is loaded, applies an ID (just like a Google analytics ID, to be determined by you), and queues up a "pageload" event that will be sent as soon as the core JS has asynchronously loaded.

The snippet handles things like making sure the core JavaScript will always be loaded async and is cache busted every 24 hours so you can update the core and have customers using the updates within the next day.

### Core
The openpixel core (found at `src/openpixel.min.js`) is the JavaScript code that that the snippet loads asynchronously onto the client's website. The core is what does all of the heavy lifting. The core handles settings cookies, collecting utms, and of course sending beacons and tracking pixels of data when events are called.

### Events
There are 2 automatic events, the `pageload` event which is sent as the main event when a page is loaded, you could consider it to be a "hit". The other event is `pageclose` and this is sent when the pages is closed or navigated away from. For example, to calculate how long a user viewed a page, you could calculate the difference between the timestamps on pageload and pageclose and those timestamps will be accurate because they are triggered on the client side when the events actually happened.

Openpixel is flexible with events though, you can make calls to any events with any data you want to be sent with the beacon. Whenever an event is called, it sends a beacon just like the other beacons that have a timestamp and everything else. Here is an example of a custom event being called. Note: In this case we are using the `opix` function name but this will be custom based on your build of openpixel.

```js
opix('event', 'reservation_requested')
```
You can also pass a string or json as the third parameter to send other data with the event.

```js
opix('event', 'reservation_requested', {someData: 1, otherData: 'cool'})
opix('event', 'reservation_requested', {someData: 1, otherData: 'cool'})
```
You can also add an attribute to any HTML element that will automatically fire the event on click.

```html
<button data-opix-event="special-button-click">Some Special Button</button>
```

## Setup and Customize
Openpixel needs to be customized for your needs before you can start using it. Luckily for you it is really easy to do.

1. Make sure you have [node.js](https://nodejs.org/en/download/) installed on your computer.
2. Install openpixel `npm i openpixel`
3. Install the dependencies for compiling openpixel via the command line with `npm install`
4. Update the variables at the top of the `gulpfile.js` for your custom configurations. Each configuration has comments explaining it.
5. Run gulp via the command `npm run dist`.

The core files and the snippet are located under the `src/` directory. If you are working on those files you can run `npm run watch` and that will watch for any files changed in the `src/` directory and rerun gulp to recompile these files and drop them in the `dist/` directory.

The `src/snippet.js` file is what is compiled into the `dist/snippet.html` file. All of the other files in the `src` directory are compiled into the `dist/openpixel.js` and the minified `dist/openpixel.min.js` files.

## Continuous integration
You may also need to build different versions of openpixel for different environments with custom options.
Environment variables can be used to configure the build:
```
OPIX_DESTINATION_FOLDER, OPIX_PIXEL_ENDPOINT, OPIX_JS_ENDPOINT, OPIX_VERSIONOPIX_PIXEL_FUNC_NAME, OPIX_VERSION, OPIX_HEADER_COMMENT
```

You can install openpixel as an npm module `npm i -ED openpixel` and use it from your bash or js code.
```
OPIX_DESTINATION_FOLDER=/home/ubuntu/app/dist OPIX_PIXEL_ENDPOINT=http://localhost:8000/pixel.gif OPIX_JS_ENDPOINT=http://localhost:800/pixel_script.js  OPIX_PIXEL_FUNC_NAME=track-function OPIX_VERSION=1 OPIX_HEADER_COMMENT="// My custom tracker\n" npx gulp --gulpfile ./node_modules/openpixel/gulpfile.js build
```

## Tracking Data
Below is a table that has all of the keys, example values, and details on each value of information that is sent with each beacon on tracking pixel. A beacon might look something like this. Note: every key is always sent regardless of if it has a value so the structure will always be the same.

```
https://tracker.example.com/pixel.gif?id=R29X8&uid=1-ovbam3yz-iolwx617&ev=pageload&ed=&v=1&dl=http://edgartownharbor.com/&rl=&ts=1464811823300&de=UTF-8&sr=1680x1050&vp=874x952&cd=24&dt=Edgartown%20Harbormaster&bn=Chrome%2050&md=false&ua=Mozilla/5.0%20(Macintosh;%20Intel%20Mac%20OS%20X%2010_11_5)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/50.0.2661.102%20Safari/537.36&utm_source=&utm_medium=&utm_term=&utm_content=&utm_campaign=
```

| Key          | Value               | Details                                                         |
| ------------ | ------------------- | --------------------------------------------------------------- |
| id           | SJO12ZW             | id for the app/website you are tracking                         |
| uid          | 1-cwq4oelu-in95g8xy | id of the user                                                  |
| ev           | pageload            | the event that is being triggered                               |
| ed           | {'somedata': 123}   | optional event data that can be passed in, string or json string|
| v            | 1                   | openpixel js version number                                     |
| dl           | http://example.com/ | document location                                               |
| rl           | http://google.com/  | referrer location                                               |
| ts           | 1461175033655       | timestamp in microseconds                                       |
| de           | UTF-8               | document encoding                                               |
| sr           | 1680x1050           | screen resolution                                               |
| vp           | 1680x295            | viewport                                                        |
| cd           | 24                  | color depth                                                     |
| dt           | Example Title       | document title                                                  |
| bn           | Chrome 50           | browser name                                                    |
| md           | false               | mobile device                                                   |
| ua           | _full user agent_   | user agent                                                      |
| tz           | 240                 | timezone offset (minutes away from utc)                         |
| utm_source   |                     | Campaign Source                                                 |
| utm_medium   |                     | Campaign Medium                                                 |
| utm_term     |                     | Campaign Term                                                   |
| utm_content  |                     | Campaign Content                                                |
| utm_campaign |                     | Campaign Name                                                   |
| utm_source_platform |              | Source platform                                                 |
| utm_creative_format |              | Creative format                                                 |
| utm_marketing_tactic |             | Marketing tactic                                                |

## Known gaps

### Purchases after the landing page lose attribution when third-party cookies are blocked

The offer redirect (`Event::AcceptsController#show` in the platform) sends the visitor to the advertiser with `?eid=<event id>` and sets `__ppxd_eid` on our `app` domain. On the advertiser's site that cookie is third-party, so Safari, Firefox (Total Cookie Protection) and Brave never send it, and the `window.uptick_cookies` copy injected by `/e/pixel.js` comes back empty for the same reason.

Only the landing page is attributed, because its `dl` still carries `?eid=`. A `purchase` on a later page goes out with no `eid`, and the server skips it as un-attributable (`Event::CreateConcern`, which returns 204).

Proposed fix: in `setup.js`, after `Cookie.setUtms()`, copy a UUID-shaped `eid` from the landing URL into a first-party `__ppxd_eid` cookie for 60 minutes, matching the redirect cookie's lifetime. `Cookie.get('eid')` already reads that cookie and sends it as the `eid` param, which the server checks before cookies, so no server change is needed. It only helps when openpixel runs on the page the redirect lands on.

### The pixel aborts before sending anything when `document.cookie` throws

`setup.js` reads and writes cookies at startup (`Cookie.exists('uid')`, `Cookie.set`, `Cookie.setUtms`) with no guard. In an opaque-origin sandbox, such as an iframe with `sandbox="allow-scripts"` but not `allow-same-origin`, the `document.cookie` getter and setter throw `SecurityError`, so the script stops before the queue is processed and no events are sent. That includes the server-injected `window.uptick_cookies` ids, which would otherwise still attribute the visit.

Proposed fix: route every `document.cookie` access in `cookie.js` through two guarded helpers, `Cookie.read()` (returns `''` on error) and `Cookie.write()` (drops the write). Have `set` and `get` use them, and add a comment explaining why the error isn't reported (the host's sandbox choice isn't actionable). Events then still send, without a persistent `uid` or UTMs, and `Cookie.get` falls back to `window.uptick_cookies`.
