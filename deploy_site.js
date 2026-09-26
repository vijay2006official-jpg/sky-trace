const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function deploy() {
  const zipPath = path.join(__dirname, 'site.zip');
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

  console.log('Creating zip archive of website files...');
  execSync(`powershell -Command "Compress-Archive -Path '${__dirname}\\index.html', '${__dirname}\\app.js', '${__dirname}\\destinations.js', '${__dirname}\\standalone_website.html' -DestinationPath '${zipPath}' -Force"`);

  const zipData = fs.readFileSync(zipPath);
  console.log(`Zip created (${zipData.length} bytes). Deploying to Netlify API...`);

  const req = https.request('https://api.netlify.com/api/v1/sites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/zip',
      'Content-Length': zipData.length
    }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(body);
        if (json.ssl_url || json.url) {
          const liveUrl = json.ssl_url || json.url;
          console.log('🎉 DEPLOY SUCCESSFUL!');
          console.log('LIVE_URL=' + liveUrl);
          fs.writeFileSync(path.join(__dirname, 'LIVE_URL.txt'), liveUrl, 'utf8');
        } else {
          console.log('Response:', body);
        }
      } catch (err) {
        console.error('Parse error:', err, body);
      }
    });
  });

  req.on('error', (err) => {
    console.error('Upload error:', err);
  });

  req.write(zipData);
  req.end();
}

deploy();
