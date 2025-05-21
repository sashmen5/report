import * as cheerio from 'cheerio';
import https from 'https';

function fetchFromPopcornmeter(url: string): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, url).href;
          fetchFromPopcornmeter(redirectUrl).then(resolve).catch(reject);
          return;
        }
        let html = '';
        res.on('data', chunk => (html += chunk));
        res.on('end', () => {
          try {
            const $ = cheerio.load(html);
            const el = $('media-scorecard [slot="audienceScore"]').first();
            const audienceScore = el.text().trim().split('%')?.at(0);
            resolve(audienceScore || undefined);
          } catch (e) {
            reject(e);
          }
        });
        res.on('error', reject);
      })
      .on('error', reject);
  });
}

export { fetchFromPopcornmeter };
