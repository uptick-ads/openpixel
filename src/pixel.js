class Pixel {
  constructor(event, timestamp, optional) {
    this.params = [];
    this.event = event;
    this.timestamp = timestamp;
    this.optional = Helper.optionalData(optional);
    this.buildParams();
    this.send();
  }

  buildParams() {
    const attr = this.getAttribute();
    for (var index in attr) {
      if (attr.hasOwnProperty(index)) {
        this.setParam(index, attr[index](index));
      }
    }
  }

  getAttribute() {
    return {
      id:                   () => Config.id, // website Id
      uid:                  () => Cookie.get('uid'), // user Id
      eid:                  () => Cookie.get('eid'), // event Id
      ev:                   () => this.event, // event being triggered
      ed:                   () => this.optional, // any event data to pass along
      v:                    () => Config.version, // openpixel.js version
      dl:                   () => window.location.href, // document location
      rl:                   () => document.referrer, // referrer location
      ts:                   () => this.timestamp, // timestamp when event was triggered
      de:                   () => document.characterSet, // document encoding
      sr:                   () => window.screen.width + 'x' + window.screen.height, // screen resolution
      vp:                   () => window.innerWidth + 'x' + window.innerHeight, // viewport size
      cd:                   () => window.screen.colorDepth, // color depth
      dt:                   () => document.title, // document title
      bn:                   () => Browser.nameAndVersion(), // browser name and version number
      md:                   () => Browser.isMobile(), // is a mobile device?
      ua:                   () => Browser.userAgent(), // user agent
      tz:                   () => (new Date()).getTimezoneOffset(), // timezone
      utm_source:           key => Cookie.getUtm(key), // get the utm source
      utm_medium:           key => Cookie.getUtm(key), // get the utm medium
      utm_term:             key => Cookie.getUtm(key), // get the utm term
      utm_content:          key => Cookie.getUtm(key), // get the utm content
      utm_campaign:         key => Cookie.getUtm(key), // get the utm campaign
      utm_source_platform:  key => Cookie.getUtm(key), // get the utm source platform
      utm_creative_format:  key => Cookie.getUtm(key), // get the utm creative format
      utm_marketing_tactic: key => Cookie.getUtm(key), // get the utm marketing tactic
      ...Config.params
    }
  }

  setParam(key, val) {
    if (Helper.isPresent(val)) {
      this.params.push(`${key}=${encodeURIComponent(val)}`);
    } else {
      this.params.push(`${key}=`);
    }
  }

  send() {
    // The pixel endpoint only accepts POST and sendBeacon is universal, so a browser without it has no working fallback and nothing actionable to report.
    if (!window.navigator.sendBeacon) return;
    window.navigator.sendBeacon(this.getSourceUrl());
  }

  getSourceUrl() {
    return `${pixelEndpoint}?${this.params.join('&')}`;
  }
}
