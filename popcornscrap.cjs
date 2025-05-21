const https = require('https');
const { JSDOM } = require('jsdom');

function fetch(url) {
  https.get(url, res => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      // Follow redirect
      const redirectUrl = res.headers.location.startsWith('http')
        ? res.headers.location
        : new URL(res.headers.location, url).href;
      fetch(redirectUrl);
      return;
    }
    let html = '';
    res.on('data', chunk => (html += chunk));
    res.on('end', () => {
      console.log(html); // Print the HTML
      const dom = new JSDOM(html);
      const el = dom.window.document.querySelectorAll('media-scorecard [slot="audienceScore"]')[0];
      console.log(
        'length',
        dom.window.document.querySelectorAll('media-scorecard [slot="audienceScore"]').length,
      );
      console.log(dom.window.document, el, el ? el.textContent.trim() : 'Not found');
    });
  });
}
